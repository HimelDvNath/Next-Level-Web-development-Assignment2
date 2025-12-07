import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config";

const createUser = async (payload: Record<string, unknown>) => {
    const { name, email, password , phone, role } = payload;
    try {
        if((password as string).length < 6){
            return 'Password size must be greater than or equal 6 characters.'
        }
        const hassPass = await bcrypt.hash(password as string, 10);
        const result = await pool.query(
            `INSERT INTO Users(name, email, password, phone, role) VALUES($1, $2,$3, $4, $5) RETURNING *`,
            [name, email, hassPass, phone, role]
        );
        return result;
    } catch (error: any) {
        throw error;
    }
};
const userLogIn = async (payload: Record<string, unknown>) => {
    const { email, password } = payload;
    try {
        const result = await pool.query(
            `SELECT * FROM Users WHERE email = $1`,
            [email]
        );
        const user = result.rows[0];
        if (!user) {
            return null;
        }
        const match = await bcrypt.compare(password as string, user.password);
        if (!match) {
            return false;
        }
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email, role: user.role },
            config.SECRET as string,
            {
                expiresIn: "7d",
            }
        );
        delete user.password;
        return { token, user };
    } catch (error: any) {
        throw error;
    }
};
export const authServices = {
    createUser,
    userLogIn,
}
