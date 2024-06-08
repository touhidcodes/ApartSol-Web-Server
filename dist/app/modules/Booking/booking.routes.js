"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/booking-requests", (0, auth_1.default)(client_1.UserRole.ADMIN), booking_controller_1.bookingControllers.getBooking);
router.get("/my-bookings", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), booking_controller_1.bookingControllers.getMyBookings);
router.post("/booking-applications", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(booking_validation_1.bookingValidationSchemas.bookingRequestSchema), booking_controller_1.bookingControllers.bookingRequest);
router.put("/booking-requests/:bookingId", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(booking_validation_1.bookingValidationSchemas.updateBookingSchema), booking_controller_1.bookingControllers.updateBooking);
exports.bookingRoutes = router;
