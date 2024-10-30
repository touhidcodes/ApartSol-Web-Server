import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { reviewServices } from "./review.service";

const createReview = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { flatId } = req.params;

  const result = await reviewServices.createReview(req.body, userId, flatId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review added successfully!",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req, res) => {
  const result = await reviewServices.getAllReviews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully!",
    data: result,
  });
});

const getFlatReviews = catchAsync(async (req, res) => {
  const { flatId } = req.params;

  const result = await reviewServices.getFlatReviews(flatId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reviews retrieved successfully!",
    data: result,
  });
});

const getSingleReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  const result = await reviewServices.getSingleReview(reviewId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review retrieved successfully!",
    data: result,
  });
});

const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  const result = await reviewServices.updateReview(reviewId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review updated successfully!",
    data: result,
  });
});

const deleteReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  const result = await reviewServices.deleteReview(reviewId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Review deleted successfully!",
    data: result,
  });
});

export const reviewControllers = {
  createReview,
  getAllReviews,
  getFlatReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
