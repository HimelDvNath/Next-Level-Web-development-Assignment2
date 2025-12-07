import { Request, Response } from "express";
import { bookingsServices } from "./bookings.service";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.createBooking(req.body, req.user as JwtPayload);

        if (typeof result === "string") {
            return res.status(400).json({
                success: true,
                message: result,
            });
        }
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.getBookings(
            req.user as JwtPayload
        );

        if (req.user?.role === "admin") {
            return res.status(201).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: result?.rows,
            });
        }
        if (req.user?.role === "customer") {
            return res.status(201).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: result?.rows,
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
const updateBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingsServices.updateBookings(
            req.params.bookingId as string,
            req.user as JwtPayload,
            req.body
        );
        if(typeof result ==='string'){
            return res.status(400).json({
                success: true,
                message: result,
                
            });
        }
        if (req.user?.role === "customer") {
           return res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result?.rows[0]
            });
        }
        if(req.user?.role === "admin"){
            return res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result?.rows[0]
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
export const bookingsController = {
    createBooking,
    getBookings,
    updateBookings,
};
