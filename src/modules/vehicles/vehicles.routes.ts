import express, { Request, Response } from "express";
import { vehiclesController } from "./vehicles.controller";
import adminAuth from "../../middleware/adminAuth";

const router = express.Router();

router.post("/", adminAuth(), vehiclesController.createVehicle);
router.get("/", vehiclesController.getVehicles);
router.get("/:vehicleId", vehiclesController.getVehicle);
router.put("/:vehicleId", adminAuth(), vehiclesController.updateVehicle);
router.delete("/:vehicleId", adminAuth(), vehiclesController.deleteVehicle);

export const vehiclesRoutes = router;
