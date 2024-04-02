import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { userServices } from "./user.service";

const createUser = catchAsync(async (req, res) => {
  const result = await userServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User registered successfully!",
    data: result,
  });
});

export const userControllers = {
  createUser,
};
