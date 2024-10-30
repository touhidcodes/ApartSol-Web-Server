import { Review } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

// Get all reviews
const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });
  return result;
};

// Get all reviews for a specific flat
const getFlatReviews = async (flatId: string) => {
  const result = await prisma.review.findMany({
    where: { flatId },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
    },
  });
  return result;
};

// Get a single review by ID
const getSingleReview = async (reviewId: string) => {
  const result = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      flat: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!result) {
    throw new APIError(httpStatus.NOT_FOUND, "Review not found!");
  }

  return result;
};

// Create a review for a specific flat
const createReview = async (
  reviewData: Review,
  userId: string,
  flatId: string
) => {
  const reviewCreateData = {
    ...reviewData,
    userId,
    flatId,
  };

  const result = await prisma.review.create({
    data: reviewCreateData,
  });
  return result;
};

// Update a review by ID
const updateReview = async (reviewId: string, reviewData: Partial<Review>) => {
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: reviewData,
  });

  if (!result) {
    throw new APIError(httpStatus.NOT_FOUND, "Review not found!");
  }

  return result;
};

// Delete a review by ID
const deleteReview = async (reviewId: string) => {
  const result = await prisma.review.delete({
    where: { id: reviewId },
  });

  if (!result) {
    throw new APIError(httpStatus.NOT_FOUND, "Review not found!");
  }

  return result;
};

export const reviewServices = {
  getAllReviews,
  getFlatReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
};
