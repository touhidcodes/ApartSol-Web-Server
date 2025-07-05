import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { paymentServices } from "./payment.service";
import prisma from "../../utils/prisma";

// const createPayment = catchAsync(async (req: Request, res: Response) => {
//   const { bookingId, paymentMethod, couponCode } = req.body;

//   // Validate required fields
//   if (!bookingId || !paymentMethod) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Booking ID and payment method are required",
//       data: null,
//     });
//   }

//   // Validate payment method
//   if (!["STRIPE", "SSL_COMMERZ"].includes(paymentMethod)) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid payment method. Use 'STRIPE' or 'SSL_COMMERZ'",
//       data: null,
//     });
//   }

//   let result;

//   // Call appropriate service based on payment method
//   if (paymentMethod === "STRIPE") {
//     result = await paymentServices.createStripePayment({
//       bookingId,
//       couponCode,
//     });
//   } else if (paymentMethod === "SSL_COMMERZ") {
//     result = await paymentServices.createSSLCommerzPayment({
//       bookingId,
//       couponCode,
//     });
//   }

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: `${paymentMethod} payment created successfully!`,
//     data: result,
//   });
// });

// // ==================== STRIPE CONTROLLERS ====================

// const processStripeWebhook = catchAsync(async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"] as string;

//   if (!sig) {
//     return res.status(httpStatus.BAD_REQUEST).send("Missing Stripe signature.");
//   }

//   await paymentServices.processStripeWebhook(req.body, sig);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Stripe webhook processed successfully!",
//     data: null,
//   });
// });

// const getStripePaymentStatus = catchAsync(
//   async (req: Request, res: Response) => {
//     const { sessionId } = req.params;

//     const result = await paymentServices.getStripePaymentStatus(sessionId);

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Stripe payment status retrieved successfully!",
//       data: result,
//     });
//   }
// );

// const refundStripePayment = catchAsync(async (req: Request, res: Response) => {
//   const { paymentId } = req.params;
//   const { refundAmount } = req.body;

//   const result = await paymentServices.refundStripePayment(
//     paymentId,
//     refundAmount
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Stripe payment refunded successfully!",
//     data: result,
//   });
// });

// ==================== SSL COMMERZ CONTROLLERS ====================

// const processSSLCommerzSuccess = catchAsync(
//   async (req: Request, res: Response) => {
//     const callbackData = req.body;

//     await paymentServices.processSSLCommerzCallback(callbackData);

//     // Redirect to success page
//     res.redirect(`${process.env.CLIENT_URL}/checkout/success`);
//   }
// );

// const processSSLCommerzFail = catchAsync(
//   async (req: Request, res: Response) => {
//     const callbackData = req.body;

//     await paymentServices.processSSLCommerzCallback(callbackData);

//     // Redirect to failure page
//     res.redirect(`${process.env.CLIENT_URL}/checkout/fail`);
//   }
// );

// const processSSLCommerzCancel = catchAsync(
//   async (req: Request, res: Response) => {
//     const callbackData = req.body;

//     await paymentServices.processSSLCommerzCallback(callbackData);

//     // Redirect to cancel page
//     res.redirect(`${process.env.CLIENT_URL}/checkout/cancel`);
//   }
// );

// const processSSLCommerzIPN = catchAsync(async (req: Request, res: Response) => {
//   const callbackData = req.body;

//   await paymentServices.processSSLCommerzCallback(callbackData);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "SSL Commerz IPN processed successfully!",
//     data: null,
//   });
// });

// const getSSLCommerzPaymentStatus = catchAsync(
//   async (req: Request, res: Response) => {
//     const { transactionId } = req.params;

//     const result = await paymentServices.getSSLCommerzPaymentStatus(
//       transactionId
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "SSL Commerz payment status retrieved successfully!",
//       data: result,
//     });
//   }
// );

// const refundSSLCommerzPayment = catchAsync(
//   async (req: Request, res: Response) => {
//     const { paymentId } = req.params;
//     const { refundAmount } = req.body;

//     const result = await paymentServices.refundSSLCommerzPayment(
//       paymentId,
//       refundAmount
//     );

//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "SSL Commerz payment refunded successfully!",
//       data: result,
//     });
//   }
// );

// ==================== COMMON CONTROLLERS ====================

// const getAllPayments = catchAsync(async (req: Request, res: Response) => {
//   const { userId } = req.query;

//   const result = await paymentServices.getAllPayments(userId as string);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Payments retrieved successfully!",
//     data: result,
//   });
// });

// const getUserPayments = catchAsync(async (req: Request, res: Response) => {
//   const { userId } = req.params;

//   const result = await paymentServices.getAllPayments(userId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User payments retrieved successfully!",
//     data: result,
//   });
// });

// const validateCoupon = catchAsync(async (req: Request, res: Response) => {
//   const { couponCode, bookingId } = req.body;

//   const coupon = await paymentServices.validateCoupon(couponCode, bookingId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Coupon is valid",
//     data: {
//       coupon: {
//         id: coupon.id,
//         code: coupon.code,
//         discountType: coupon.discountType,
//         discountValue: coupon.discountValue,
//         maxDiscount: coupon.maxDiscount,
//         usageLimit: coupon.usageLimit,
//         usageCount: coupon.usageCount,
//         expiresAt: coupon.expiresAt,
//       },
//     },
//   });
// });

// ==================== GENERIC PAYMENT STATUS AND REFUND ====================

// const getPaymentStatus = catchAsync(async (req: Request, res: Response) => {
//   const { sessionId } = req.params;
//   const { paymentMethod } = req.query;

//   if (
//     !paymentMethod ||
//     !["STRIPE", "SSL_COMMERZ"].includes(paymentMethod as string)
//   ) {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Valid payment method is required (STRIPE or SSL_COMMERZ)",
//       data: null,
//     });
//   }

//   let result;

//   if (paymentMethod === "STRIPE") {
//     result = await paymentServices.getStripePaymentStatus(sessionId);
//   } else if (paymentMethod === "SSL_COMMERZ") {
//     result = await paymentServices.getSSLCommerzPaymentStatus(sessionId);
//   }

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `${paymentMethod} payment status retrieved successfully!`,
//     data: result,
//   });
// });

// const refundPayment = catchAsync(async (req: Request, res: Response) => {
//   const { paymentId } = req.params;
//   const { refundAmount } = req.body;

//   // First, get the payment to determine the payment method
//   const payment = await prisma.payment.findUnique({
//     where: { id: paymentId },
//   });

//   if (!payment) {
//     return sendResponse(res, {
//       statusCode: httpStatus.NOT_FOUND,
//       success: false,
//       message: "Payment not found",
//       data: null,
//     });
//   }

//   let result;

//   // Call appropriate refund service based on payment method
//   if (payment.paymentMethod === "STRIPE") {
//     result = await paymentServices.refundStripePayment(paymentId, refundAmount);
//   } else if (payment.paymentMethod === "SSL_COMMERZ") {
//     result = await paymentServices.refundSSLCommerzPayment(
//       paymentId,
//       refundAmount
//     );
//   } else {
//     return sendResponse(res, {
//       statusCode: httpStatus.BAD_REQUEST,
//       success: false,
//       message: "Invalid payment method for refund",
//       data: null,
//     });
//   }

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `${payment.paymentMethod} payment refunded successfully!`,
//     data: result,
//   });
// });
