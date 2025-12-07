import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../config/db";

const userAuth = () => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const bearerToken = req.headers.authorization;
            const token = bearerToken?.split(" ")[1];
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: "Provide Bearer Token and  Try again!!",
                    errors: "Bearer Token Not Found!",
                });
            }

            const decoder = jwt.verify(
                token as string,
                config.SECRET as string
            ) as JwtPayload;

            req.user = decoder as JwtPayload;
  
            const email = decoder.email as string;
            const role = decoder.role as string;
            const id = req.params.userId as string;
            const user = await pool.query(`SELECT * FROM Users WHERE id=$1`, [id]);
            if (
                role.toLowerCase() === "admin" ||
                user.rows[0].email === email
            ) {
                return next();
            }
            return res.status(401).json({
                success: false,
                message: "Only admin or own User allowed",
                errors: "Access Denied",
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message,
                errors: error,
            });
        }
    };
};
export default userAuth;
