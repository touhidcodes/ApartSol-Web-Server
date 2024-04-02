import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/register", userControllers.createUser);

router.get("/profile", auth(), userControllers.getUser);

router.put("/profile", auth(), userControllers.updateUser);

export const userRoutes = router;
