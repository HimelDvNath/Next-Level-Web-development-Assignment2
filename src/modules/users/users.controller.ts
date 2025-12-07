import { Request, Response } from "express";
import { usersServices } from "./users.service";
import { JwtPayload } from "jsonwebtoken";


const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.getUsers();
        const users = result.rows.map((user) => {
            delete user.password;
        });

        return res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows.length ? result.rows : [],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
const updateUser = async (req: Request, res: Response) => {
    const role = req.user;
    try {
        const result = await usersServices.updateUser(
            req.params.userId as string,
            role?.role,
            req.body
        );
        if (!result) {
           return res.status(401).json({
                success: false,
                message: "Oops! User can not update role",
            });
        }else{
            delete result.rows[0].password;
            return res.status(200).json({
                success: true,
                message: "User updated successfully",
                data: result.rows[0],
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
const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await usersServices.deleteUser(
            req.params.userId as string
        );

        if (typeof result === "string") {
            return res.status(400).json({
                success: true,
                message: result,
            });
        }
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
export const usersController = {
    getUsers,
    updateUser,
    deleteUser
};
