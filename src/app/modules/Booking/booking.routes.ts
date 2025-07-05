import express from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking.controller";
import { bookingValidationSchemas } from "./booking.validation";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Get all bookings (admin only)
router.get("/all", auth(UserRole.ADMIN), bookingControllers.getBooking);

// Get current user's bookings
router.get(
  "/user",
  auth(UserRole.ADMIN, UserRole.USER),
  bookingControllers.getMyBookings
);

// Create a new booking
router.post(
  "/:propertyId",
  auth(UserRole.ADMIN, UserRole.USER),
  validateRequest(bookingValidationSchemas.bookingRequestSchema),
  bookingControllers.bookingRequest
);

// Update a specific booking
router.put(
  "/:bookingId",
  auth(UserRole.ADMIN),
  validateRequest(bookingValidationSchemas.updateBookingSchema),
  bookingControllers.updateBooking
);

export const bookingRoutes = router;
