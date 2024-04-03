import { Booking } from "@prisma/client";
import prisma from "../../utils/prisma";

const getBooking = async () => {
  const result = await prisma.booking.findMany();
  return result;
};

const bookingRequest = async (userId: string, flatId: string) => {
  const bookingRequestData = {
    userId,
    flatId,
  };

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
};
