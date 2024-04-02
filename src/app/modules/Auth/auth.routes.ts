import express from "express";
import { authControllers } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/login", authControllers.loginUser);

export const authRoutes = router;
