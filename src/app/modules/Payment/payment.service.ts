import Stripe from "stripe";
import prisma from "../../utils/prisma";
import config from "../../config/config";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";
import { TCreatePaymentInput } from "./payment.interface";

const stripe = new Stripe(config.stripe.secret_key!, {
  apiVersion: "2022-11-15" as any,
  typescript: true,
});

const createPayment = async (paymentData: TCreatePaymentInput) => {
  const {
    bookingId,
    finalAmount,
    billingName,
    billingEmail,
    billingPhone,
    billingLocation,
  } = paymentData;

  // Fetch booking and user
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { property: true },
  });

  if (!booking) {
    throw new APIError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: booking.userId },
  });

  if (!user) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found");
  }

  // Create Stripe session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: booking.property.title },
          unit_amount: Math.round(finalAmount * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${config.client.client_url}/checkout/success`,
    cancel_url: `${config.client.client_url}/checkout/cancel`,
    metadata: {
      bookingId: booking.id,
    },
    customer_email: billingEmail,
  });

  // Save payment info to DB
  const paymentRecord = await prisma.payment.create({
    data: {
      amount: booking.totalAmount,
      finalAmount,
      currency: "USD",
      status: "PENDING",
      paymentMethod: "STRIPE",
      stripeId: session.id,
      userId: booking.userId,
      bookingId: booking.id,
      billingName,
      billingEmail,
      billingPhone,
      billingLocation,
    },
  });

  return { paymentRecord, url: session.url };
};

const processWebhook = async (payload: Buffer, sig: string) => {
  let event: Stripe.Event;

  try {
    if (!config.stripe.webhook_secret) {
      throw new APIError(
        httpStatus.BAD_REQUEST,
        "Webhook secret not configured"
      );
    }

    event = stripe.webhooks.constructEvent(
      payload,
      sig,
      config.stripe.webhook_secret
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          throw new APIError(
            httpStatus.BAD_REQUEST,
            "Missing bookingId in metadata"
          );
        }

        await prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: bookingId },
            data: { status: "BOOKED" },
          });

          await tx.payment.updateMany({
            where: { bookingId },
            data: { status: "COMPLETED" },
          });
        });

        break;
      }

      default:
        console.warn(`Unhandled Stripe event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook Error:", err);
    throw new APIError(httpStatus.BAD_REQUEST, "Webhook processing failed");
  }
};

const getPaymentStatus = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new APIError(httpStatus.NOT_FOUND, "Session not found");
  }

  return {
    status: session.payment_status,
    customer_email: session.customer_email,
    amount_total: session.amount_total,
    currency: session.currency,
  };
};

export const paymentServices = {
  createPayment,
  processWebhook,
  getPaymentStatus,
};
