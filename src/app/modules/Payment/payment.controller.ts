import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.body;
  const result = await paymentServices.createPayment(bookingId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment created successfully!",
    data: result,
  });
});

const processWebhook = catchAsync(async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  const result = await paymentServices.processWebhook(req.body, sig);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment validate successfully!",
    data: result,
  });
});

const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const result = await paymentServices.getPaymentStatus(sessionId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment status retrieved successfully!",
    data: result,
  });
});

export const paymentController = {
  createPayment,
  processWebhook,
  getPaymentStatus,
};
