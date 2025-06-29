import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { blogControllers } from "./blog.controller";
import { blogValidationSchemas } from "./blog.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get("/", blogControllers.getBlogs);

router.get("/:blogId", blogControllers.getSingleBlog);

router.get(
  "/my-blogs",
  auth(UserRole.USER, UserRole.ADMIN),
  blogControllers.getMyBlogs
);

router.post(
  "/",
  auth(UserRole.USER, UserRole.AGENT, UserRole.ADMIN),
  validateRequest(blogValidationSchemas.createBlogSchema),
  blogControllers.createBlog
);

router.put(
  "/:blogId",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(blogValidationSchemas.updateBlogSchema),
  blogControllers.updateBlog
);

router.delete(
  "/:blogId",
  auth(UserRole.USER, UserRole.ADMIN),
  blogControllers.deleteBlog
);

export const blogRoutes = router;
