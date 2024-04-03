import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { flatServices } from "./flat.service";

const createFlat = catchAsync(async (req, res) => {
  const result = await flatServices.createFlat(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat added successfully!",
    data: result,
  });
});

const updateFlat = catchAsync(async (req, res) => {
  const { flatId } = req.params;
  const result = await flatServices.updateFlat(flatId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat added successfully!",
    data: result,
  });
});

export const flatControllers = {
  createFlat,
  updateFlat,
};
