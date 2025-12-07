import { Request, Response } from "express";
import { vehicleServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body);

        return res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
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
const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicles();

        return res.status(200).json({
            success: true,
            message: result.rows.length
                ? "Vehicles retrieved successfully"
                : "No vehicles found",
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
const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicle(
            req.params.vehicleId as string
        );

        if (result.rows.length) {
            return res.status(200).json({
                success: true,
                message: "Vehicles retrieved successfully",
                data: result.rows[0],
            });
        } else {
            return res.status(404).json({
                success: true,
                message: "Vehicles retrieved successfully",
                data: "Vehicle is not registered",
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
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.updateVehicle(
            req.params.vehicleId as string,
            req.body
        );
        if (result.rowCount) {
            return res.status(200).json({
                success: true,
                message: "Vehicle updated successfully",
                data: result.rows[0],
            });
        }
        return res.status(404).json({
            success: true,
            message: "Vehicle is not found",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.deleteVehicle(
            req.params.vehicleId as string
        );
        if (result.rowCount) {
            return res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
            });
        }
        return res.status(400).json({
            success: true,
            message:
                "Vehicle already booked. Not possible to delete at this moment.",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};
export const vehiclesController = {
    createVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle,
};
