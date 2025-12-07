import express from "express";
import { bookingsController } from "./bookings.controller";
import bookingAuth from "../../middleware/bookingAuth";
const router = express.Router();

router.post('/', bookingAuth(), bookingsController.createBooking)
router.get('/', bookingAuth(), bookingsController.getBookings)
router.put('/:bookingId', bookingAuth(), bookingsController.updateBookings)
export const bookingsRoutes = router;