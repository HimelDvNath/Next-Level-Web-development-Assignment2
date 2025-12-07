import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";

const getUsers = async () => {
    try {
        return await pool.query(`
                SELECT * FROM Users
            `);
    } catch (error: any) {
        throw error;
    }
};
const updateUser = async (id: string, userRole:string, payload: Record<string, unknown>) => {
    const { name, email, password, phone, role } = payload;

    try {
        if(role !== undefined && userRole!=="admin"){
            return false
        }
        if (password !== undefined) {
            await pool.query(
                `
                UPDATE Users SET password=$1 WHERE id=$2
            `,
                [password, id]
            );
        }
        if (email !== undefined) {
            await pool.query(
                `
                UPDATE Users SET email=$1 WHERE id=$2
            `,
                [email, id]
            );
        }
        if (name !== undefined) {
            await pool.query(
                `
                UPDATE Users SET name=$1 WHERE id=$2
            `,
                [name, id]
            );
        }
        if (phone !== undefined) {
            await pool.query(
                `
                UPDATE Users SET phone=$1 WHERE id=$2
            `,
                [phone, id]
            );
        }
        
        if (role !== undefined && userRole==="admin" ) {
            await pool.query(
                `
                UPDATE Users SET role=$1 WHERE id=$2
            `,
                [role, id]
            );
        }
        return await pool.query(`SELECT * FROM Users WHERE id=$1`, [id]);
    } catch (error: any) {
        throw error;
    }
};
const deleteUser = async (id: string) => {
    try {
        const booking = await pool.query(`SELECT * FROM Bookings WHERE customer_id=$1`, [id]);

        const haveBooking = booking.rows.find(booking => booking.status==='active');

        if(haveBooking){
            return 'Is not possible to delete user. Because of user have booked vehicle'
        }

        return pool.query(
            `
            DELETE FROM Users WHERE id=$1
            `,
            [id]
        );
    } catch (error: any) {
        throw new Error('User deleted suspend');
    }
};
export const usersServices = {
    getUsers,
    updateUser,
    deleteUser
};
