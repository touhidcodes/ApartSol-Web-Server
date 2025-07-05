import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";
import { Request } from "express";

const getBookings = catchAsync(async (req, res) => {
  const result = await bookingServices.getBookings();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings retrieved successfully!",
    data: result,
  });
});

const getUserBookings = catchAsync(async (req: Request, res) => {
  const { userId } = req.user;

  const result = await bookingServices.getUserBookings(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your bookings retrieved successfully!",
    data: result,
  });
});

const getBookingById = catchAsync(async (req: Request, res) => {
  const { bookingId } = req.params;

  const result = await bookingServices.getBookingById(bookingId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your bookings retrieved successfully!",
    data: result,
  });
});

const bookingRequest = catchAsync(async (req: Request, res) => {
  const { userId } = req.user;
  const { propertyId } = req.params;
  const { totalAmount, notes } = req.body;

  const result = await bookingServices.bookingRequest({
    userId,
    propertyId,
    totalAmount,
    notes,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking request submitted successfully!",
    data: result,
  });
});

const updateBooking = catchAsync(async (req, res) => {
  const { bookingId } = req.params;

  const result = await bookingServices.updateBooking(bookingId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking updated successfully!",
    data: result,
  });
});

export const bookingControllers = {
  getBookings,
  getUserBookings,
  getBookingById,
  bookingRequest,
  updateBooking,
};
