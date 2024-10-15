import express from "express";
import { paymentController } from "./payment.controller";
import bodyParser from "body-parser";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create-payment",
  auth(UserRole.USER),
  paymentController.createPayment
);
router.get("/payment-status/:sessionId", paymentController.getPaymentStatus);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentController.processWebhook
);

export const paymentRoutes = router;
