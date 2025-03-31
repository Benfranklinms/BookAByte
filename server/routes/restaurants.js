/**
 * BookABite - Restaurant Routes
 *
 * This file contains routes for restaurant operations
 */

const express = require("express")
const Restaurant = require("../models/Restaurant")
const router = express.Router()

/**
 * @route   GET /api/restaurants
 * @desc    Get all restaurants
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
    res.json(restaurants)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * @route   GET /api/restaurants/:id
 * @desc    Get restaurant by ID
 * @access  Public
 */
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }
    res.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router

