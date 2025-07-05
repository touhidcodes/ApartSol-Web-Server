// import Stripe from "stripe";
// import prisma from "../../utils/prisma";
// import config from "../../config/config";
// import APIError from "../../errors/APIError";
// import httpStatus from "http-status";

// const stripe = new Stripe(config.stripe.secret_key!, {
//   apiVersion: "2022-11-15" as any,
//   typescript: true,
// });

// // SSL Commerz integration (you'll need to install sslcommerz-lts)
// // import SSLCommerzPayment from 'sslcommerz-lts';

// interface PaymentData {
//   bookingId: string;
//   couponCode?: string;
// }

// // Common utility function to calculate discount
// const calculateFinalAmount = async (amount: number, couponCode?: string) => {
//   let discountAmount = 0;
//   let coupon = null;

//   if (couponCode) {
//     coupon = await prisma.coupon.findUnique({
//       where: { code: couponCode, isActive: true },
//     });

//     if (coupon && new Date() <= coupon.validUntil) {
//       if (coupon.discountType === "PERCENTAGE") {
//         discountAmount = (amount * coupon.discountValue) / 100;
//       } else if (coupon.discountType === "FIXED_AMOUNT") {
//         discountAmount = coupon.discountValue;
//       }

//       // Ensure discount doesn't exceed the original amount
//       discountAmount = Math.min(discountAmount, amount);
//     }
//   }

//   return {
//     discountAmount,
//     finalAmount: amount - discountAmount,
//     coupon,
//   };
// };

// // Common utility function to get booking and user data
// const getBookingAndUser = async (bookingId: string) => {
//   const booking = await prisma.booking.findUnique({
//     where: { id: bookingId },
//     include: { property: true },
//   });

//   if (!booking) {
//     throw new APIError(httpStatus.NOT_FOUND, "Booking not found");
//   }

//   const user = await prisma.user.findUnique({
//     where: { id: booking.userId },
//   });

//   if (!user) {
//     throw new APIError(httpStatus.NOT_FOUND, "User not found");
//   }

//   return { booking, user };
// };

// // ==================== STRIPE PAYMENT FUNCTIONS ====================

// const createStripePayment = async (paymentData: PaymentData) => {
//   const { bookingId, couponCode } = paymentData;

//   // Get booking and user data
//   const { booking, user } = await getBookingAndUser(bookingId);

//   // Calculate final amount with coupon discount
//   const { discountAmount, finalAmount, coupon } = await calculateFinalAmount(
//     booking.property.rent,
//     couponCode
//   );

//   try {
//     // Create a Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: { name: booking.property.title },
//             unit_amount: Math.round(finalAmount * 100), // Convert to cents
//           },
//           quantity: 1,
//         },
//       ],
//       mode: "payment",
//       success_url: `${config.client.client_url}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${config.client.client_url}/checkout/cancel`,
//       metadata: {
//         bookingId: booking.id,
//         paymentMethod: "STRIPE",
//       },
//       customer_email: user.email,
//     });

//     // Store payment information in the database
//     const paymentRecord = await prisma.payment.create({
//       data: {
//         amount: booking.property.rent,
//         currency: "USD",
//         status: "PENDING",
//         paymentMethod: "STRIPE",
//         stripeId: session.id,
//         couponId: coupon?.id,
//         discountAmount: discountAmount,
//         finalAmount: finalAmount,
//         userId: booking.userId,
//         bookingId: booking.id,
//       },
//     });

//     return { paymentRecord, url: session.url };
//   } catch (error) {
//     console.error("Stripe payment creation error:", error);
//     throw new APIError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to create Stripe payment"
//     );
//   }
// };

// const processStripeWebhook = async (payload: Buffer, sig: string) => {
//   let event: Stripe.Event;

//   try {
//     if (config.stripe.webhook_secret as string) {
//       event = stripe.webhooks.constructEvent(
//         payload,
//         sig!,
//         config.stripe.webhook_secret as string
//       );
//     } else {
//       throw new APIError(
//         httpStatus.BAD_REQUEST,
//         `Webhook endpoint secret not found`
//       );
//     }

//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;
//         await handleStripeSuccessfulPayment(
//           session.metadata?.bookingId!,
//           session.id
//         );
//         break;
//       }
//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
//         await handleStripeFailedPayment(
//           paymentIntent.metadata?.bookingId!,
//           paymentIntent.id
//         );
//         break;
//       }
//       default:
//         console.log(`Unhandled Stripe event type: ${event.type}`);
//     }
//   } catch (err) {
//     console.log("Stripe webhook error:", err);
//     throw new APIError(httpStatus.BAD_REQUEST, `Stripe webhook error`);
//   }
// };

// const handleStripeSuccessfulPayment = async (
//   bookingId: string,
//   stripeId: string
// ) => {
//   try {
//     await prisma.$transaction(async (tx) => {
//       // Update booking status to "BOOKED"
//       await tx.booking.update({
//         where: { id: bookingId },
//         data: { status: "BOOKED" },
//       });

//       // Update payment status to "COMPLETED"
//       const payment = await tx.payment.updateMany({
//         where: { bookingId: bookingId, stripeId: stripeId },
//         data: { status: "COMPLETED" },
//       });

//       // Update coupon usage if applicable
//       const paymentData = await tx.payment.findFirst({
//         where: { bookingId: bookingId, stripeId: stripeId },
//         include: { coupon: true },
//       });

//       if (paymentData?.coupon) {
//         await tx.coupon.update({
//           where: { id: paymentData.coupon.id },
//           data: { currentUsage: { increment: 1 } },
//         });
//       }
//     });
//   } catch (error) {
//     console.error("Error handling Stripe successful payment:", error);
//     throw new APIError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Error processing Stripe successful payment"
//     );
//   }
// };

// const handleStripeFailedPayment = async (
//   bookingId: string,
//   stripeId: string
// ) => {
//   try {
//     await prisma.$transaction(async (tx) => {
//       // Update booking status to "CANCELLED"
//       await tx.booking.update({
//         where: { id: bookingId },
//         data: { status: "CANCELLED" },
//       });

//       // Update payment status to "FAILED"
//       await tx.payment.updateMany({
//         where: { bookingId: bookingId, stripeId: stripeId },
//         data: { status: "FAILED" },
//       });
//     });
//   } catch (error) {
//     console.error("Error handling Stripe failed payment:", error);
//     throw new APIError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Error processing Stripe failed payment"
//     );
//   }
// };

// const getStripePaymentStatus = async (sessionId: string) => {
//   try {
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     return session;
//   } catch (error) {
//     console.error("Error getting Stripe payment status:", error);
//     throw new APIError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Failed to get Stripe payment status"
//     );
//   }
// };

// const refundStripePayment = async (
//   paymentId: string,
//   refundAmount?: number
// ) => {
//   const payment = await prisma.payment.findUnique({
//     where: { id: paymentId },
//   });

//   if (!payment) {
//     throw new APIError(httpStatus.NOT_FOUND, "Payment not found");
//   }

//   if (payment.status !== "COMPLETED") {
//     throw new APIError(httpStatus.BAD_REQUEST, "Payment cannot be refunded");
//   }

//   if (payment.paymentMethod !== "STRIPE") {
//     throw new APIError(httpStatus.BAD_REQUEST, "This is not a Stripe payment");
//   }

//   const refundAmountToProcess = refundAmount || payment.finalAmount;

//   try {
//     const session = await stripe.checkout.sessions.retrieve(payment.stripeId!);
//     if (session.payment_intent) {
//       await stripe.refunds.create({
//         payment_intent: session.payment_intent as string,
//         amount: Math.round(refundAmountToProcess * 100),
//       });
//     }

//     // Update payment status
//     const isPartialRefund = refundAmountToProcess < payment.finalAmount;
//     await prisma.payment.update({
//       where: { id: paymentId },
//       data: {
//         status: isPartialRefund ? "PARTIALLY_REFUNDED" : "REFUNDED",
//       },
//     });

//     return { success: true, refundAmount: refundAmountToProcess };
//   } catch (error) {
//     console.error("Stripe refund error:", error);
//     throw new APIError(
//       httpStatus.INTERNAL_SERVER_ERROR,
//       "Error processing Stripe refund"
//     );
//   }
// };

// // ==================== SSL COMMERZ PAYMENT FUNCTIONS ====================

// // const createSSLCommerzPayment = async (paymentData: PaymentData) => {
// //   const { bookingId, couponCode } = paymentData;

// //   // Get booking and user data
// //   const { booking, user } = await getBookingAndUser(bookingId);

// //   // Calculate final amount with coupon discount
// //   const { discountAmount, finalAmount, coupon } = await calculateFinalAmount(
// //     booking.property.rent,
// //     couponCode
// //   );

// //   try {
// //     // Generate unique transaction ID
// //     const transactionId = `TXN_${Date.now()}_${booking.id}`;

// //     // SSL Commerz configuration
// //     const store_id = config.sslCommerz.store_id;
// //     const store_passwd = config.sslCommerz.store_passwd;
// //     const is_live = config.sslCommerz.is_live || false;

// //     // You'll need to uncomment and configure this when you have SSL Commerz setup
// //     /*
// //     const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

// //     const data = {
// //       total_amount: finalAmount,
// //       currency: 'BDT',
// //       tran_id: transactionId,
// //       success_url: `${config.server.server_url}/api/v1/payments/ssl-commerz/success`,
// //       fail_url: `${config.server.server_url}/api/v1/payments/ssl-commerz/fail`,
// //       cancel_url: `${config.server.server_url}/api/v1/payments/ssl-commerz/cancel`,
// //       ipn_url: `${config.server.server_url}/api/v1/payments/ssl-commerz/ipn`,
// //       shipping_method: 'NO',
// //       product_name: booking.property.title,
// //       product_category: 'Property Booking',
// //       product_profile: 'general',
// //       cus_name: user.name,
// //       cus_email: user.email,
// //       cus_add1: user.address || 'N/A',
// //       cus_phone: user.phone || 'N/A',
// //       cus_city: user.city || 'N/A',
// //       cus_state: user.state || 'N/A',
// //       cus_postcode: user.postcode || 'N/A',
// //       cus_country: user.country || 'Bangladesh',
// //       cus_fax: user.fax || 'N/A',
// //       ship_name: user.name,
// //       ship_add1: user.address || 'N/A',
// //       ship_city: user.city || 'N/A',
// //       ship_state: user.state || 'N/A',
// //       ship_postcode: user.postcode || 'N/A',
// //       ship_country: user.country || 'Bangladesh',
// //       multi_card_name: 'mastercard,visacard,amexcard',
// //       value_a: booking.id,
// //       value_b: 'SSL_COMMERZ',
// //       value_c: coupon?.id || '',
// //       value_d: discountAmount.toString(),
// //     };

// //     const apiResponse = await sslcz.init(data);
// //     */

// //     // Store payment information in the database
// //     const paymentRecord = await prisma.payment.create({
// //       data: {
// //         amount: booking.property.rent,
// //         currency: "BDT",
// //         status: "PENDING",
// //         paymentMethod: "SSL_COMMERZ",
// //         sslCommerzId: transactionId,
// //         transactionId: transactionId,
// //         couponId: coupon?.id,
// //         discountAmount: discountAmount,
// //         finalAmount: finalAmount,
// //         userId: booking.userId,
// //         bookingId: booking.id,
// //       },
// //     });

// //     // Return mock URL for SSL Commerz (replace with actual SSL Commerz response)
// //     return {
// //       paymentRecord,
// //       url: `${config.sslCommerz.gateway_url}?tran_id=${transactionId}`, // Replace with actual SSL Commerz URL
// //     };
// //   } catch (error) {
// //     console.error("SSL Commerz payment creation error:", error);
// //     throw new APIError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Failed to create SSL Commerz payment"
// //     );
// //   }
// // };

// // const processSSLCommerzCallback = async (callbackData: any) => {
// //   try {
// //     const {
// //       tran_id,
// //       status,
// //       val_id,
// //       amount,
// //       currency,
// //       card_type,
// //       bank_tran_id,
// //     } = callbackData;

// //     if (status === "VALID") {
// //       // Verify the transaction with SSL Commerz
// //       // const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
// //       // const validation = await sslcz.validate({ val_id });

// //       // For now, we'll assume validation is successful
// //       const payment = await prisma.payment.findFirst({
// //         where: { transactionId: tran_id },
// //       });

// //       if (payment) {
// //         await handleSSLCommerzSuccessfulPayment(payment.bookingId, tran_id);
// //       }
// //     } else {
// //       const payment = await prisma.payment.findFirst({
// //         where: { transactionId: tran_id },
// //       });

// //       if (payment) {
// //         await handleSSLCommerzFailedPayment(payment.bookingId, tran_id);
// //       }
// //     }
// //   } catch (error) {
// //     console.log("SSL Commerz callback error:", error);
// //     throw new APIError(httpStatus.BAD_REQUEST, "SSL Commerz callback error");
// //   }
// // };

// // const handleSSLCommerzSuccessfulPayment = async (
// //   bookingId: string,
// //   transactionId: string
// // ) => {
// //   try {
// //     await prisma.$transaction(async (tx) => {
// //       // Update booking status to "BOOKED"
// //       await tx.booking.update({
// //         where: { id: bookingId },
// //         data: { status: "BOOKED" },
// //       });

// //       // Update payment status to "COMPLETED"
// //       await tx.payment.updateMany({
// //         where: { bookingId: bookingId, transactionId: transactionId },
// //         data: { status: "COMPLETED" },
// //       });

// //       // Update coupon usage if applicable
// //       const paymentData = await tx.payment.findFirst({
// //         where: { bookingId: bookingId, transactionId: transactionId },
// //         include: { coupon: true },
// //       });

// //       if (paymentData?.coupon) {
// //         await tx.coupon.update({
// //           where: { id: paymentData.coupon.id },
// //           data: { usageCount: { increment: 1 } },
// //         });
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Error handling SSL Commerz successful payment:", error);
// //     throw new APIError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Error processing SSL Commerz successful payment"
// //     );
// //   }
// // };

// // const handleSSLCommerzFailedPayment = async (
// //   bookingId: string,
// //   transactionId: string
// // ) => {
// //   try {
// //     await prisma.$transaction(async (tx) => {
// //       // Update booking status to "CANCELLED"
// //       await tx.booking.update({
// //         where: { id: bookingId },
// //         data: { status: "CANCELLED" },
// //       });

// //       // Update payment status to "FAILED"
// //       await tx.payment.updateMany({
// //         where: { bookingId: bookingId, transactionId: transactionId },
// //         data: { status: "FAILED" },
// //       });
// //     });
// //   } catch (error) {
// //     console.error("Error handling SSL Commerz failed payment:", error);
// //     throw new APIError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Error processing SSL Commerz failed payment"
// //     );
// //   }
// // };

// // const getSSLCommerzPaymentStatus = async (transactionId: string) => {
// //   try {
// //     const payment = await prisma.payment.findFirst({
// //       where: { transactionId: transactionId },
// //       include: { booking: true, user: true, coupon: true },
// //     });

// //     if (!payment) {
// //       throw new APIError(httpStatus.NOT_FOUND, "Payment not found");
// //     }

// //     return payment;
// //   } catch (error) {
// //     console.error("Error getting SSL Commerz payment status:", error);
// //     throw new APIError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Failed to get SSL Commerz payment status"
// //     );
// //   }
// // };

// // const refundSSLCommerzPayment = async (
// //   paymentId: string,
// //   refundAmount?: number
// // ) => {
// //   const payment = await prisma.payment.findUnique({
// //     where: { id: paymentId },
// //   });

// //   if (!payment) {
// //     throw new APIError(httpStatus.NOT_FOUND, "Payment not found");
// //   }

// //   if (payment.status !== "COMPLETED") {
// //     throw new APIError(httpStatus.BAD_REQUEST, "Payment cannot be refunded");
// //   }

// //   if (payment.paymentMethod !== "SSL_COMMERZ") {
// //     throw new APIError(
// //       httpStatus.BAD_REQUEST,
// //       "This is not an SSL Commerz payment"
// //     );
// //   }

// //   const refundAmountToProcess = refundAmount || payment.finalAmount;

// //   try {
// //     // SSL Commerz refund logic would go here
// //     // For now, we'll just update the payment status

// //     // Update payment status
// //     const isPartialRefund = refundAmountToProcess < payment.finalAmount;
// //     await prisma.payment.update({
// //       where: { id: paymentId },
// //       data: {
// //         status: isPartialRefund ? "PARTIALLY_REFUNDED" : "REFUNDED",
// //       },
// //     });

// //     return { success: true, refundAmount: refundAmountToProcess };
// //   } catch (error) {
// //     console.error("SSL Commerz refund error:", error);
// //     throw new APIError(
// //       httpStatus.INTERNAL_SERVER_ERROR,
// //       "Error processing SSL Commerz refund"
// //     );
// //   }
// // };

// // ==================== COMMON FUNCTIONS ====================

// const getAllPayments = async (userId?: string) => {
//   const whereClause = userId ? { userId } : {};

//   const payments = await prisma.payment.findMany({
//     where: whereClause,
//     include: {
//       booking: {
//         include: {
//           property: true,
//         },
//       },
//       user: true,
//       coupon: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });

//   return payments;
// };

// const validateCoupon = async (couponCode: string, bookingId: string) => {
//   const coupon = await prisma.coupon.findUnique({
//     where: { code: couponCode, isActive: true },
//   });

//   if (!coupon) {
//     throw new APIError(httpStatus.NOT_FOUND, "Invalid or expired coupon");
//   }

//   if (new Date() > coupon.validUntil) {
//     throw new APIError(httpStatus.BAD_REQUEST, "Coupon has expired");
//   }

//   // Check if coupon has usage limit
//   if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
//     throw new APIError(httpStatus.BAD_REQUEST, "Coupon usage limit exceeded");
//   }

//   return coupon;
// };

// export const paymentServices = {
//   // Stripe functions
//   createStripePayment,
//   processStripeWebhook,
//   getStripePaymentStatus,
//   refundStripePayment,

//   // SSL Commerz functions
//   //   createSSLCommerzPayment,
//   //   processSSLCommerzCallback,
//   //   getSSLCommerzPaymentStatus,
//   //   refundSSLCommerzPayment,

//   // Common functions
//   getAllPayments,
//   validateCoupon,
// };
