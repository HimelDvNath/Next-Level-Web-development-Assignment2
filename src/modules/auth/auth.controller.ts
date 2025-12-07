import { Request, Response } from "express";
import { authServices } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authServices.createUser(req.body);
        if (typeof result === "string") {
            return res.status(400).json({
                success: false,
                message: result,
            });
        }
        delete result.rows[0].password;
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
const userLogIn = async (req: Request, res: Response) => {
    try {
        const result = await authServices.userLogIn(req.body);

        if (result === null) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                errors: "Check email. Then try again!",
            });
        } else if (!result) {
            return res.status(400).json({
                success: false,
                message: "Password is wrong",
                errors: "Check password. Then try again!",
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    token: result.token as string,
                    user: result.user,
                },
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
export const authController = {
    userLogIn,
    createUser,
};
