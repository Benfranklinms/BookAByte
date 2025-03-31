const express = require("express");
const Reservation = require("../models/Reservation");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * @route   POST /api/reservations
 * @desc    Create a new reservation
 * @access  Private
 */


router.get("/user", authenticateToken, async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.user.id })
      .populate("restaurantId", "name") // Populate restaurant name
      .sort({ date: -1 }); // Sort by date (newest first)

    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching user reservations:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.post("/", authenticateToken, async (req, res) => {
  try {
    const { restaurantId, name, email, phone, date, time, guests, specialRequests } = req.body;

    // Validate phone number format
    if (!/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ 
        success: false,
        message: "Phone number must be 10-15 digits"
      });
    }

    // Create new reservation with authenticated user
    const reservation = new Reservation({
      userId: req.user.id, // From auth middleware
      restaurantId,
      name,
      email,
      phone,
      date: new Date(date),
      time,
      guests: parseInt(guests),
      specialRequests,
      status: "confirmed"
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation
    });
  } catch (error) {
    console.error("Reservation creation error:", error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
});

module.exports = router;