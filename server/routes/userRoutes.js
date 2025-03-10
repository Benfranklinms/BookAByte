import express from "express";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";

const router = express.Router();

router.use("/api/feedback", feedbackRoutes);
router.use("/api/payments", paymentRoutes);
router.use("/api/restaurants", restaurantRoutes);

export default router;
