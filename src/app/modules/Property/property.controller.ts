import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { propertyServices } from "./property.service";
import queryPickers from "../../utils/queryPickers";
import { propertyFilterableFields } from "./property.constants";

const createProperty = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await propertyServices.createProperty(req.body, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property added successfully!",
    data: result,
  });
});

const getAllProperties = catchAsync(async (req, res) => {
  const filters = queryPickers(req.query, propertyFilterableFields);
  const options = queryPickers(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await propertyServices.getAllProperties(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Properties retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleProperty = catchAsync(async (req, res) => {
  const { propertyId } = req.params;
  const result = await propertyServices.getSingleProperty(propertyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property added successfully!",
    data: result,
  });
});

const getMyProperties = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await propertyServices.getMyProperties(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property added successfully!",
    data: result,
  });
});

const updateProperty = catchAsync(async (req, res) => {
  const { propertyId } = req.params;

  const result = await propertyServices.updateProperty(propertyId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property updated successfully!",
    data: result,
  });
});

const deleteProperty = catchAsync(async (req, res) => {
  const { propertyId } = req.params;

  const result = await propertyServices.deleteProperty(propertyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Property deleted successfully!",
    data: result,
  });
});

export const propertyControllers = {
  createProperty,
  getAllProperties,
  updateProperty,
  getSingleProperty,
  getMyProperties,
  deleteProperty,
};
