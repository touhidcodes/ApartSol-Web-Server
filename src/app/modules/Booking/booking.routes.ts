import express from "express";
import auth from "../../middlewares/auth";
import { bookingControllers } from "./booking.controller";
import { bookingValidationSchemas } from "./booking.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/booking-applications",
  auth(),
  validateRequest(bookingValidationSchemas.bookingRequestSchema),
  bookingControllers.bookingRequest
);

export const bookingRoutes = router;
