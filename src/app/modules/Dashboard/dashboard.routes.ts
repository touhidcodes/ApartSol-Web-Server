import express from "express";
import auth from "../../middlewares/auth";
import { dashboardControllers } from "./dashboard.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Shared routes (accessible by both ADMIN and USER)
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
router.get(
  "/user-dashboard",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserDashboardStats
);

// NEW: User-specific routes (accessible by both ADMIN and USER)
router.get(
  "/user-property-types",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserPropertyTypesDistribution
);
router.get(
  "/user-monthly-sales",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserMonthlySalesData
);
router.get(
  "/user-recent-properties",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserRecentProperties
);
router.get(
  "/user-recent-bookings",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserRecentBookings
);
router.get(
  "/user-monthly-revenue-breakdown",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserMonthlyRevenueBreakdown
);
router.get(
  "/user-property-booking-trends",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserPropertyBookingTrends
);
router.get(
  "/user-total-revenue",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserTotalRevenue
);
router.get(
  "/user-monthly-revenue-growth",
  auth(UserRole.ADMIN, UserRole.USER),
  dashboardControllers.getUserMonthlyRevenueGrowth
);

// Admin-only routes
router.get(
  "/property-type",
  auth(UserRole.ADMIN),
  dashboardControllers.getPropertyTypesDistribution
);
router.get(
  "/monthly-sales",
  auth(UserRole.ADMIN),
  dashboardControllers.getMonthlySalesData
);
router.get(
  "/recent-properties",
  auth(UserRole.ADMIN),
  dashboardControllers.getRecentProperties
);
router.get(
  "/recent-bookings",
  auth(UserRole.ADMIN),
  dashboardControllers.getRecentBookings
);
router.get(
  "/top-locations",
  auth(UserRole.ADMIN),
  dashboardControllers.getTopLocations
);
router.get(
  "/total-revenue",
  auth(UserRole.ADMIN),
  dashboardControllers.getTotalRevenue
);
router.get(
  "/monthly-revenue-growth",
  auth(UserRole.ADMIN),
  dashboardControllers.getMonthlyRevenueGrowth
);
router.get(
  "/user-growth",
  auth(UserRole.ADMIN),
  dashboardControllers.getUserGrowthStats
);
router.get(
  "/property-growth",
  auth(UserRole.ADMIN),
  dashboardControllers.getPropertyGrowthStats
);
router.get(
  "/monthly-revenue-breakdown",
  auth(UserRole.ADMIN),
  dashboardControllers.getMonthlyRevenueBreakdown
);
router.get(
  "/admin-dashboard",
  auth(UserRole.ADMIN),
  dashboardControllers.getAdminDashboardStats
);
router.get(
  "/booking-status",
  auth(UserRole.ADMIN),
  dashboardControllers.getBookingStatusDistribution
);
router.get(
  "/payment-methods",
  auth(UserRole.ADMIN),
  dashboardControllers.getPaymentMethodDistribution
);
router.get(
  "/user-status",
  auth(UserRole.ADMIN),
  dashboardControllers.getUserStatusDistribution
);

export const dashboardRoutes = router;
