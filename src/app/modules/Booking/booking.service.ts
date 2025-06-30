import { Booking } from "@prisma/client";
import prisma from "../../utils/prisma";
import APIError from "../../errors/APIError";
import httpStatus from "http-status";

const getBooking = async () => {
  const result = await prisma.booking.findMany({
    include: {
      property: {
        select: {
          title: true,
          rent: true,
        },
      },
    },
  });
  return result;
};

const getMyBookings = async (userId: string) => {
  const result = await prisma.booking.findMany({
    where: { userId: userId },
    include: {
      property: {
        select: {
          title: true,
          rent: true,
        },
      },
    },
  });
  return result;
};

const bookingRequest = async (userId: string, propertyId: string) => {
  const bookingRequestData = {
    userId,
    propertyId,
  };

  const checkRequest = await prisma.booking.findFirst({
    where: { userId: userId, propertyId: propertyId },
  });

  if (checkRequest) {
    return {
      success: false,
      message: "You have already booked this property!",
      data: checkRequest,
    };
  }

  const result = await prisma.booking.create({
    data: bookingRequestData,
  });
  return result;
};

const updateBooking = async (
  bookingId: string,
  bookingData: Partial<Booking>
) => {
  const result = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: bookingData,
  });
  return result;
};

export const bookingServices = {
  bookingRequest,
  getBooking,
  updateBooking,
  getMyBookings,
};
