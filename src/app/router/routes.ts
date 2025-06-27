import express from "express";
import { userRoutes } from "../modules/User/user.routes";
import { authRoutes } from "../modules/Auth/auth.routes";
import { flatRoutes } from "../modules/Flat/flat.routes";
import { bookingRoutes } from "../modules/Booking/booking.routes";
import { dashboardRoutes } from "../modules/Dashboard/dashboard.routes";
import { paymentRoutes } from "../modules/Payment/payment.routes";
import { reviewRoutes } from "../modules/Review/review.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: authRoutes,
  },
  {
    path: "/flats",
    route: flatRoutes,
  },
  {
    path: "/",
    route: bookingRoutes,
  },
  {
    path: "/",
    route: dashboardRoutes,
  },
  {
    path: "/",
    route: paymentRoutes,
  },
  {
    path: "/",
    route: reviewRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
