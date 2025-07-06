import { Booking } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

interface BookingRequestData {
  userId: string;
  propertyId: string;
  totalAmount: number;
  notes?: string;
}

const getBookings = async () => {
  const result = await prisma.booking.findMany({
    include: {
      property: {
        select: {
          title: true,
          price: true,
        },
      },
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

const getUserBookings = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: { userId: userId },
    include: {
      property: {
        select: {
          title: true,
          price: true,
          city: true,
          state: true,
          country: true,
        },
      },
      payment: {
        select: {
          status: true,
          amount: true,
          finalAmount: true,
        },
      },
    },
  });
  return result;
};

const bookingRequest = async (bookingData: BookingRequestData) => {
  const { userId, propertyId, totalAmount, notes } = bookingData;

  // Check if property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new APIError(httpStatus.NOT_FOUND, "Property not found!");
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new APIError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Check if user already has any booking (pending/confirmed) for this property
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      propertyId,
      status: {
        in: ["PENDING", "CONFIRMED", "BOOKED"],
      },
    },
  });

  if (existingBooking) {
    return {
      success: false,
      message: "You have already booked this property!",
      data: null,
    };
  }

  // Use transaction to ensure both operations succeed or fail together
  const result = await prisma.$transaction(async (tx) => {
    // Create new booking
    const booking = await tx.booking.create({
      data: {
        userId,
        propertyId,
        totalAmount,
        notes,
      },
      include: {
        property: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });

    // Update property availability to false
    await tx.property.update({
      where: { id: propertyId },
      data: { availability: false },
    });

    return booking;
  });

  return result;
};

const getBookingById = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      property: true,
    },
  });

  if (!result) {
    throw new APIError(httpStatus.NOT_FOUND, "Booking not found");
  }

  return result;
};

const updateBooking = async (
  bookingId: string,
  bookingData: Partial<Booking>
) => {
  const existingBooking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!existingBooking) {
    throw new APIError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: bookingData,
    include: {
      property: {
        select: {
          title: true,
          price: true,
        },
      },
      user: {
        select: {
          username: true,
          email: true,
        },
      },
      payment: {
        select: {
          status: true,
          amount: true,
          finalAmount: true,
        },
      },
    },
  });

  return result;
};

const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new APIError(httpStatus.NOT_FOUND, "Booking not found");
  }

  if (booking.userId !== userId) {
    throw new APIError(
      httpStatus.FORBIDDEN,
      "You can only cancel your own bookings"
    );
  }

  if (booking.status === "CANCELLED") {
    throw new APIError(httpStatus.BAD_REQUEST, "Booking is already cancelled");
  }

  if (booking.status === "COMPLETED") {
    throw new APIError(
      httpStatus.BAD_REQUEST,
      "Cannot cancel completed booking"
    );
  }

  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
    include: {
      property: {
        select: {
          title: true,
          price: true,
        },
      },
    },
  });

  return result;
};

export const bookingServices = {
  bookingRequest,
  getBookings,
  updateBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
};
