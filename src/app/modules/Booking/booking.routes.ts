import express from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking.controller";
import { bookingValidationSchemas } from "./booking.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/booking-requests", auth(), bookingControllers.getBooking);

router.post(
  "/booking-applications",
  auth(),
  validateRequest(bookingValidationSchemas.bookingRequestSchema),
  bookingControllers.bookingRequest
);

router.put(
  "/booking-requests/:bookingId",
  auth(),
  validateRequest(bookingValidationSchemas.updateBookingSchema),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
