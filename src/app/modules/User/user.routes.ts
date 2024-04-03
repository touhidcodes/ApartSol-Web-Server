import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidationSchema } from "./user.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidationSchema.createUserSchema),
  userControllers.createUser
);

router.get("/profile", auth(), userControllers.getUser);

router.put(
  "/profile",
  auth(),
  validateRequest(userValidationSchema.updateUserSchema),
  userControllers.updateUser
);

export const userRoutes = router;
