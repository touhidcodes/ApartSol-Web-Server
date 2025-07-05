import express from "express";
import auth from "../../middlewares/auth";
import { couponControllers } from "./coupon.controller";
import validateRequest from "../../middlewares/validateRequest";
import { couponValidationSchemas } from "./coupon.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Public routes
router.get("/active", couponControllers.getActiveCoupons);

// Admin only routes
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  couponControllers.getAllCoupons
);

router.get(
  "/:couponId",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  couponControllers.getSingleCoupon
);

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  validateRequest(couponValidationSchemas.createCouponSchema),
  couponControllers.createCoupon
);

router.put(
  "/:couponId",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  validateRequest(couponValidationSchemas.updateCouponSchema),
  couponControllers.updateCoupon
);

router.delete(
  "/:couponId",
  auth(UserRole.ADMIN, UserRole.SUPERADMIN),
  couponControllers.deleteCoupon
);

// User accessible routes
router.get(
  "/code/:code",
  auth(UserRole.USER, UserRole.AGENT, UserRole.ADMIN),
  couponControllers.getCouponByCode
);

router.post(
  "/validate/:code",
  auth(UserRole.USER, UserRole.AGENT, UserRole.ADMIN),
  validateRequest(couponValidationSchemas.validateCouponSchema),
  couponControllers.validateCoupon
);

export const couponRoutes = router;
