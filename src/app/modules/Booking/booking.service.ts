import prisma from "../../utils/prisma";

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

export const bookingServices = {
  bookingRequest,
};
