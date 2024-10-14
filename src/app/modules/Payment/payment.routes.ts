import express from "express";
import { paymentController } from "./payment.controller";

const router = express.Router();

router.post("/create-payment", paymentController.createPayment);
router.get("/payment-status/:sessionId", paymentController.getPaymentStatus);
router.post("/webhook", paymentController.processWebhook);

export const paymentRoutes = router;
