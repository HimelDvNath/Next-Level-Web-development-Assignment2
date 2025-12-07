import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
    const {
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
    } = payload;
    try {
        const result = await pool.query(
            `INSERT INTO Vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2,$3, $4, $5) RETURNING *`,
            [
                vehicle_name,
                type,
                registration_number,
                daily_rent_price,
                availability_status,
            ]
        );
        return result;
    } catch (error: any) {
        throw error;
    }
};
const getVehicles = async () => {
    try {
        return await pool.query(`SELECT * FROM Vehicles`);
    } catch (error: any) {
        throw error;
    }
};
const getVehicle = async (id: string) => {
    try {
        return await pool.query(`SELECT * FROM Vehicles WHERE id=$1`, [id]);
    } catch (error: any) {
        throw error;
    }
};
const updateVehicle = async (id: string, payload: Record<string, unknown>) => {
    const {vehicle_name, type,registration_number, daily_rent_price, availability_status } = payload;
    try {
        if (availability_status) {
             await pool.query(
                `
                UPDATE Vehicles SET availability_status=$1 WHERE id=$2
            `,
                [availability_status, id]
            );
        }
        if (registration_number) {
             await pool.query(
                `
                UPDATE Vehicles SET registration_number=$1 WHERE id=$2
            `,
                [registration_number, id]
            );
        }
        if (daily_rent_price) {
             await pool.query(
                `
                UPDATE Vehicles SET daily_rent_price=$1 WHERE id=$2
            `,
                [daily_rent_price, id]
            );
        }
        if (vehicle_name) {
             await pool.query(
                `
                UPDATE Vehicles SET vehicle_name=$1 WHERE id=$2
            `,
                [vehicle_name, id]
            );
        }
        if (type) {
             await pool.query(
                `
                UPDATE Vehicles SET type=$1 WHERE id=$2
            `,
                [type, id]
            );
        }

        return await pool.query(
            `
                SELECT * FROM Vehicles WHERE id=$1
            `,
            [id]
        );
    } catch (error: any) {
        throw error;
    }
};
const deleteVehicle = async (id: string) => {
    try {
        return pool.query(
            `
            DELETE FROM Vehicles WHERE availability_status='available' AND id=$1
            `,
            [id]
        );
    } catch (error: any) {
        throw error;
    }
};
export const vehicleServices = {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
};
