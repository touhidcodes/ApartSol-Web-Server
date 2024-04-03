import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bookingServices } from "./booking.service";

const bookingRequest = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { flatId } = req.body;
  const result = await bookingServices.bookingRequest(userId, flatId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking requests submitted successfully!",
    data: result,
  });
});

export const bookingControllers = {
  bookingRequest,
};
