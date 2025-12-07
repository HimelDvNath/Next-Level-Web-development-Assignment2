import { pool } from "../../config/db";
import AutoBookingExpire from "../../middleware/autoBookingExpire";

const createBooking = async (
    payload: Record<string, unknown>,
    userPayload: Record<string, unknown>
) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    const start_date = new Date(rent_start_date as string);
    const end_date = new Date(rent_end_date as string);
    const number_of_days = Math.ceil(
        (end_date.getTime() - start_date.getTime()) / (1000 * 60 * 60 * 24)
    );

    try {
        const customer = await pool.query(`SELECT * FROM Users WHERE id=$1`, [
            customer_id,
        ]);
        const vehicle = await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [
            vehicle_id,
        ]);
        if (customer.rows.length === 0) {
            return "customer not found";
        }
        if (vehicle.rows.length === 0) {
            return "Vehicle not found";
        }
        if (userPayload.role === "customer" && customer_id !== userPayload.id) {
            return "You could booking only your!";
        }
        if (vehicle.rows[0].availability_status !== "available") {
            return "Vehicle is not available";
        }

        const total_price =
            (vehicle.rows[0].daily_rent_price as number) * number_of_days;
        const status = "active";
        const booking = await pool.query(
            `INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                customer_id,
                vehicle_id,
                rent_start_date,
                rent_end_date,
                total_price,
                status,
            ]
        );
        await pool.query(
            `UPDATE Vehicles SET availability_status=$1 WHERE id=$2`,
            ["booked", vehicle_id]
        );
        return {
            ...booking.rows[0],
            rent_start_date: new Date(
                booking.rows[0].rent_start_date
            ).toLocaleDateString("en-CA"),
            rent_end_date: new Date(
                booking.rows[0].rent_end_date
            ).toLocaleDateString("en-CA"),
            vehicle: {
                vehicle_name: vehicle.rows[0].vehicle_name,
                daily_rent_price: vehicle.rows[0].daily_rent_price,
            },
        };
    } catch (error: any) {
        throw new Error("Bookings suspended!!");
    }
};
const getBookings = async (payload: Record<string, unknown>) => {
    // AutoBookingExpire();
    try {
        if (payload.role === "admin") {
            const bookings = await pool.query(`SELECT * FROM Bookings`);
            await Promise.all(
                bookings.rows.map(async (booking) => {
                    const customer = await pool.query(
                        "SELECT * FROM Users WHERE id=$1",
                        [booking.customer_id]
                    );
                    const vehicle = await pool.query(
                        "SELECT * FROM Vehicles WHERE id=$1",
                        [booking.vehicle_id]
                    );

                    booking.rent_start_date = new Date(
                        booking.rent_start_date
                    ).toLocaleDateString("en-CA");
                    booking.rent_end_date = new Date(
                        booking.rent_end_date
                    ).toLocaleDateString("en-CA");

                    booking.customer = {
                        name: customer.rows[0].name,
                        email: customer.rows[0].email,
                    };
                    booking.vehicle = {
                        vehicle_name: vehicle.rows[0].vehicle_name,
                        registration_number:
                            vehicle.rows[0].registration_number,
                    };
                })
            );
            return bookings;
        }
        if (payload.role === "customer") {
            const bookings = await pool.query(
                `SELECT * FROM Bookings WHERE customer_id=$1`,
                [payload.id]
            );
            await Promise.all(
                bookings.rows.map(async (booking) => {
                    const vehicle = await pool.query(
                        "SELECT * FROM Vehicles WHERE id=$1",
                        [booking.vehicle_id]
                    );

                    booking.rent_start_date = new Date(
                        booking.rent_start_date
                    ).toLocaleDateString("en-CA");
                    booking.rent_end_date = new Date(
                        booking.rent_end_date
                    ).toLocaleDateString("en-CA");

                    booking.vehicle = {
                        vehicle_name: vehicle.rows[0].vehicle_name,
                        registration_number:
                            vehicle.rows[0].registration_number,
                        type: vehicle.rows[0].type,
                    };
                })
            );
            return bookings;
        }
    } catch (error: any) {
        throw new Error("Booking fetch suspend");
    }
};
const updateBookings = async (
    bookingId: string,
    userPayload: Record<string, unknown>,
    bodyPayload: Record<string, unknown>
) => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    try {
        if (userPayload.role === "customer") {
            const preBooking = await pool.query(
                `SELECT * FROM Bookings WHERE id=$1`,
                [bookingId]
            );
            const bookingData = preBooking.rows[0];

            if (bookingData.length === 0) {
                return "No booking found";
            }
            const rentStartDate = new Date(
                bookingData.rent_start_date
            ).toLocaleDateString("en-CA");
            if (
                bodyPayload.status === "cancelled" &&
                rentStartDate < formattedDate
            ) {
                return "You could not cancelled. Your rent already start.";
            }

            const booking = await pool.query(
                `UPDATE Bookings SET status=$1 WHERE id=$2 AND customer_id=$3 RETURNING *`,
                [bodyPayload.status, bookingId, userPayload.id]
            );
            if (booking.rows.length === 0) {
                return "You could not change status. You could change only own booking.";
            }
            booking.rows[0].rent_start_date = new Date(
                booking.rows[0].rent_start_date
            ).toLocaleDateString("en-CA");
            booking.rows[0].rent_end_date = new Date(
                booking.rows[0].rent_end_date
            ).toLocaleDateString("en-CA");

            const newStatus = "available";
            await pool.query(
                `UPDATE Vehicles SET availability_status=$1 WHERE id=$2`,
                [newStatus, booking.rows[0].vehicle_id]
            );
            return booking;
        }
        if (userPayload.role === "admin") {
            const booking = await pool.query(
                `UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *`,
                [bodyPayload.status, bookingId]
            );
            if (booking.rows.length === 0) {
                return "Booking Id Invalid.Please check and try again!!";
            }
            booking.rows[0].rent_start_date = new Date(
                booking.rows[0].rent_start_date
            ).toLocaleDateString("en-CA");
            booking.rows[0].rent_end_date = new Date(
                booking.rows[0].rent_end_date
            ).toLocaleDateString("en-CA");

            const newStatus = "available";

            const updateVehicle = await pool.query(
                `UPDATE Vehicles SET availability_status=$1 WHERE id=$2 RETURNING *`,
                [newStatus, booking.rows[0].vehicle_id]
            );
            booking.rows[0].vehicle = {
                availability_status: updateVehicle.rows[0].availability_status,
            };
            return booking;
        }
    } catch (error: any) {
        throw new Error("Booking Update Suspended");
    }
};
export const bookingsServices = {
    createBooking,
    getBookings,
    updateBookings,
};
