import express from "express";
import auth from "../../middlewares/auth";
import { dashboardControllers } from "./dashboard.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/user-reg",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserRegistrationTrends
);

router.get(
  "/user-month",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.monthlyTotalUsers
);

router.get(
  "/user-role",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserByRole
);

router.get(
  "/user-all",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.totalUser
);

router.get(
  "/bookings-all",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.totalBookings
);

router.get(
  "/post-all",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.totalPost
);

router.get(
  "/total-bookings-user",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.totalBookingsByUser
);

router.get(
  "/bookings-user",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.bookingsByUser
);

router.get(
  "/total-flats-user",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.totalFlatPostByUser
);

router.get(
  "/flats-user",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.flatPostByUser
);

export const dashboardRoutes = router;
