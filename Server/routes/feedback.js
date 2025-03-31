/**
 * BookABite - Feedback Routes
 *
 * This file contains routes for feedback operations
 */

const express = require("express")
const Feedback = require("../models/Feedback")
const router = express.Router()

/**
 * @route   POST /api/feedback
 * @desc    Submit feedback
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { restaurantId, name, email, rating, message, recommend } = req.body

    // Create new feedback
    const feedback = new Feedback({
      restaurantId,
      name,
      email,
      rating,
      message,
      recommend,
    })

    // If user is authenticated, associate feedback with user
    if (req.user) {
      feedback.userId = req.user.id
    }

    await feedback.save()

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    })
  } catch (error) {
    console.error("Error submitting feedback:", error)
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * @route   GET /api/feedback
 * @desc    Get all feedback
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("restaurantId", "name").sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

