import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { couponServices } from "./coupon.service";
import queryPickers from "../../utils/queryPickers";
import { couponFilterableFields } from "./coupon.constants";

const createCoupon = catchAsync(async (req, res) => {
  const result = await couponServices.createCoupon(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Coupon created successfully!",
    data: result,
  });
});

const getAllCoupons = catchAsync(async (req, res) => {
  const filters = queryPickers(req.query, couponFilterableFields);
  const options = queryPickers(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await couponServices.getAllCoupons(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupons retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;

  const result = await couponServices.getSingleCoupon(couponId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon retrieved successfully!",
    data: result,
  });
});

const getCouponByCode = catchAsync(async (req, res) => {
  const { code } = req.params;

  const result = await couponServices.getCouponByCode(code);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon retrieved successfully!",
    data: result,
  });
});

const validateCoupon = catchAsync(async (req, res) => {
  const { code } = req.params;
  const { orderAmount } = req.body;
  const { userId } = req.user;

  const result = await couponServices.validateCoupon(code, orderAmount, userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon validated successfully!",
    data: result,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;

  const result = await couponServices.updateCoupon(couponId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon updated successfully!",
    data: result,
  });
});

const deleteCoupon = catchAsync(async (req, res) => {
  const { couponId } = req.params;

  const result = await couponServices.deleteCoupon(couponId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Coupon deleted successfully!",
    data: result,
  });
});

const getActiveCoupons = catchAsync(async (req, res) => {
  const options = queryPickers(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await couponServices.getActiveCoupons(options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Active coupons retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const couponControllers = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  getCouponByCode,
  validateCoupon,
  updateCoupon,
  deleteCoupon,
  getActiveCoupons,
};
