import { Review } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

// Get all reviews
const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
          role: true,
          UserProfile: {
            select: {
              image: true,
              name: true,
            },
          },
        },
      },
      property: {
        select: {
          title: true,
        },
      },
    },
  });
  return result;
};

// Get all reviews for a specific property
const getPropertyReviews = async (propertyId: string) => {
  const result = await prisma.review.findMany({
    where: { propertyId, isDeleted: false },
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
      property: {
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

// Create a review for a specific property
const createReview = async (
  reviewData: Review,
  userId: string,
  propertyId: string
) => {
  const { name, email, rating, comment } = reviewData;
  const result = await prisma.review.create({
    data: {
      name,
      email,
      rating,
      comment,
      user: {
        connect: { id: userId },
      },
      property: {
        connect: { id: propertyId },
      },
    },
  });
  return result;
};

const getPropertyReviewByUser = async (userId: string, propertyId: string) => {
  return await prisma.review.findFirst({
    where: {
      userId: userId,
      propertyId: propertyId,
    },
  });
};

const getUsersReview = async (userId: string) => {
  return await prisma.review.findMany({
    where: {
      userId: userId,
      isDeleted: false,
    },
    include: {
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      property: {
        select: {
          title: true,
        },
      },
    },
  });
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
  const result = await prisma.review.update({
    where: { id: reviewId },
    data: {
      isDeleted: true,
    },
  });

  if (!result) {
    throw new APIError(httpStatus.NOT_FOUND, "Review not found!");
  }

  return result;
};

export const reviewServices = {
  getAllReviews,
  getPropertyReviews,
  getUsersReview,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getPropertyReviewByUser,
};
