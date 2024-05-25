import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidationSchema.createUserSchema),
  userControllers.createUser
);

router.get("/profile", auth(), userControllers.getUserProfile);

router.get(
  "/user",
  auth(UserRole.ADMIN, UserRole.USER),
  userControllers.getUser
);

router.put(
  "/profile",
  auth(),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUser
);

export const userRoutes = router;
