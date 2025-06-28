import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import queryPickers from "../../utils/queryPickers";
import { blogFilterableFields } from "./blog.constants";
import { blogServices } from "./blog.service";

const createBlog = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const result = await blogServices.createBlog(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Blog created successfully!",
    data: result,
  });
});

const getBlogs = catchAsync(async (req, res) => {
  const filters = queryPickers(req.query, blogFilterableFields);
  const options = queryPickers(req.query, [
    "limit",
    "page",
    "sortBy",
    "sortOrder",
  ]);

  const result = await blogServices.getBlogs(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blogs retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const result = await blogServices.getSingleBlog(blogId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog retrieved successfully!",
    data: result,
  });
});

const getMyBlogs = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await blogServices.getMyBlogs(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your blogs retrieved successfully!",
    data: result,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const result = await blogServices.updateBlog(blogId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog updated successfully!",
    data: result,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  const { blogId } = req.params;

  const result = await blogServices.deleteBlog(blogId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Blog deleted successfully!",
    data: result,
  });
});

export const blogControllers = {
  createBlog,
  getBlogs,
  getSingleBlog,
  getMyBlogs,
  updateBlog,
  deleteBlog,
};
