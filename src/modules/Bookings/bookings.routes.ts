import express from "express";
import { bookingsController } from "./bookings.controller";
import bookingAuth from "../../middleware/bookingAuth";
import AutoBookingExpire from "../../middleware/autoBookingExpire";
const router = express.Router();

router.post('/', bookingAuth(), AutoBookingExpire(), bookingsController.createBooking)
router.get('/', bookingAuth(), AutoBookingExpire(), bookingsController.getBookings)
router.put('/:bookingId', bookingAuth(), bookingsController.updateBookings)
export const bookingsRoutes = router;