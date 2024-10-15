import express from "express";
import { paymentController } from "./payment.controller";
import bodyParser from "body-parser";

const router = express.Router();

router.post("/create-payment", paymentController.createPayment);
router.get("/payment-status/:sessionId", paymentController.getPaymentStatus);
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentController.processWebhook
);

export const paymentRoutes = router;
