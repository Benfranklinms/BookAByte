const express = require("express");
const Reservation = require("../models/Reservation");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * @route   POST /api/reservations
 * @desc    Create a new reservation
 * @access  Private
 */
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { restaurantId, name, email, phone, date, time, guests, specialRequests } = req.body;

    // Validate required fields
    if (!restaurantId || !name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ 
        success: false,
        message: "Please fill in all required fields"
      });
    }

    // Validate phone number format
    if (!/^[0-9]{10,15}$/.test(phone)) {
      return res.status(400).json({ 
        success: false,
        message: "Phone number must be 10-15 digits"
      });
    }

    // Validate email format
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please enter a valid email address"
      });
    }

    // Validate date is in the future
    const reservationDate = new Date(date);
    if (reservationDate < new Date()) {
      return res.status(400).json({ 
        success: false,
        message: "Reservation date must be in the future"
      });
    }

    // Validate guests number
    if (guests < 1 || guests > 10) {
      return res.status(400).json({ 
        success: false,
        message: "Number of guests must be between 1 and 10"
      });
    }

    // Create new reservation with authenticated user
    const reservation = new Reservation({
      userId: req.user.id, // From auth middleware
      restaurantId,
      name,
      email,
      phone,
      date: reservationDate,
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