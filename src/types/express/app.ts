import express, { Request, Response } from "express";
import initDB from "../../config/db";
import { authRoutes } from "../../modules/auth/auth.routes";
import { usersRoutes } from "../../modules/users/users.routes";
import { vehiclesRoutes } from "../../modules/vehicles/vehicles.routes";
import { bookingsRoutes } from "../../modules/Bookings/bookings.routes";

const app = express();

//database
initDB();

//parsing
app.use(express.json());

//routes
app.use("/api/v1/auth", authRoutes); //auth
app.use("/api/v1/users", usersRoutes); //user
app.use("/api/v1/vehicles", vehiclesRoutes); //vehicle
app.use("/api/v1/bookings", bookingsRoutes); //booking


app.get("/", (req: Request, res: Response) => {
    res.send("Vehicle Rental System server is running!");
});

export default app;
