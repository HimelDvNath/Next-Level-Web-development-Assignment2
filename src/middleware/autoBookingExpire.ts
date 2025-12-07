import { NextFunction, Request, Response } from "express";
import { pool } from "../config/db";

const AutoBookingExpire = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const day = currentDate.getDate().toString().padStart(2, "0");
        const todayDate = `${year}-${month}-${day}`;

        try {
            const bookingsPromise = await pool.query(`SELECT * FROM Bookings`);
            const booking = bookingsPromise.rows;

            await Promise.all(
                booking.map(async (eachBookings) => {
                    const returnDate = new Date(
                        eachBookings.rent_end_date
                    ).toLocaleDateString("en-CA");
                    if (returnDate < todayDate) {
                        await pool.query(
                            `UPDATE Bookings SET status=$1 WHERE id=$2`,
                            ["returned", eachBookings.id]
                        );
                        await pool.query(
                            `UPDATE Vehicles SET availability_status=$1 WHERE id=$2`,
                            ["available", eachBookings.vehicle_id]
                        );
                    }
                })
            );
            return next()
        } catch (error: any) {
            throw new Error("Auto expire problem.");
        }
    };
};
export default AutoBookingExpire;
