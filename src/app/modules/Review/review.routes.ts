import express from "express";
import auth from "../../middlewares/auth";
import { reviewControllers } from "./review.controller";
import validateRequest from "../../middlewares/validateRequest";
import { reviewValidationSchemas } from "./review.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

// Get all reviews
router.get("/", reviewControllers.getAllReviews);

// Get all reviews
router.get("/user", auth(UserRole.USER), reviewControllers.getUsersReview);

// Get all reviews for a specific flat
router.get("/:flatId", reviewControllers.getFlatReviews);

// Get a single review by ID
router.get("/:reviewId", reviewControllers.getSingleReview);

// Create a review for a flat
router.post(
  "/:flatId",
  auth(UserRole.USER),
  validateRequest(reviewValidationSchemas.createReviewSchema),
  reviewControllers.createReview
);

// Update a review by ID
router.put(
  "/:reviewId",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(reviewValidationSchemas.updateReviewSchema),
  reviewControllers.updateReview
);

// Delete a review by ID
router.delete(
  "/:reviewId",
  auth(UserRole.USER, UserRole.ADMIN),
  reviewControllers.deleteReview
);

export const reviewRoutes = router;
