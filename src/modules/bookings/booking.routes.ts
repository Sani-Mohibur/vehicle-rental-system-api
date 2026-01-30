import express from "express";
import auth from "../../middlewares/auth.middleware";
import { userRole } from "../users/user.constant";
import { BookingController } from "./booking.controller";

const router = express.Router();

router.post(
  "/",
  auth(userRole.admin, userRole.customer),
  BookingController.createBooking,
);
router.get(
  "/",
  auth(userRole.admin, userRole.customer),
  BookingController.getAllBookings,
);
router.put(
  "/:bookingId",
  auth(userRole.admin, userRole.customer),
  BookingController.updateBooking,
);

export const BookingRoutes = router;
