import Feedback from "../models/feedback.js";

// @desc  Submit feedback
// @route POST /api/feedback
// @access Public
export const submitFeedback = async (req, res) => {
    try {
        const { userId, reservationId, rating, comment } = req.body;

        // Validate required fields
        if (!userId || !reservationId || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save feedback in DB
        const feedback = new Feedback({ userId, reservationId, rating, comment });
        await feedback.save();

        res.status(201).json({ message: "Feedback submitted successfully", feedback });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error: error.message });
    }
};
