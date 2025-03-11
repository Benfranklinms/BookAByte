import express from "express";
import { submitFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// Route to submit feedback
router.post("/submit", submitFeedback);

export default router;
