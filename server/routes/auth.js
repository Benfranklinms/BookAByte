/**
 * BookABite - Authentication Routes
 *
 * This file contains routes for user authentication
 */

const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const { authenticateToken } = require("../middleware/auth")
const router = express.Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ message: "Username or email already exists" })
    }

    // Create new user
    const user = new User({
      username,
      password,
      email,
      firstName,
      lastName,
    })

    await user.save()

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" })
    }

    // Create and sign JWT
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || "your_jwt_secret", {
      expiresIn: "1h",
    })

    res.json({ token })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

/**
 * @route   GET /api/auth/me
 * @desc    Get current user data
 * @access  Private
 */
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout the user
 * @access  Private
 */
router.post("/logout", authenticateToken, (req, res) => {
  try {
    // Invalidate the token on the server if using a token blacklist (optional)
    // For now, just respond with success
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router

