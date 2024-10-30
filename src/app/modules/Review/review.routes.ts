import express from "express";
import auth from "../../middlewares/auth";
import { reviewControllers } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidationSchemas } from "./review.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Get all reviews
router.get("/reviews", reviewControllers.getAllReviews);

// Get all reviews for a specific flat
router.get("/reviews/:flatId", reviewControllers.getFlatReviews);

// Get a single review by ID
router.get("/reviews/:reviewId", reviewControllers.getSingleReview);

// Create a review for a flat
router.post(
  "/reviews/:flatId",
  auth(UserRole.USER),
  validateRequest(reviewValidationSchemas.createReviewSchema),
  reviewControllers.createReview
);

// Update a review by ID
router.put(
  "/reviews/:reviewId",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(reviewValidationSchemas.updateReviewSchema),
  reviewControllers.updateReview
);

// Delete a review by ID
router.delete(
  "/reviews/:reviewId",
  auth(UserRole.USER, UserRole.ADMIN),
  reviewControllers.deleteReview
);

export const reviewRoutes = router;
