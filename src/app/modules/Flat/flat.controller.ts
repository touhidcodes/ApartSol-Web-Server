import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { flatServices } from "./flat.service";
import queryPickers from "../../utils/queryPickers";
import { flatFilterableFields } from "./flat.constants";

const createFlat = catchAsync(async (req, res) => {
  const result = await flatServices.createFlat(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat added successfully!",
    data: result,
  });
});

const getFlats = catchAsync(async (req, res) => {
  // console.log(req.query)
  const filters = queryPickers(req.query, flatFilterableFields);
  const options = queryPickers(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await flatServices.getFlats(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flats retrieved successfully!",
    meta: result.meta,
    data: result.data,
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
  getFlats,
  updateFlat,
};
