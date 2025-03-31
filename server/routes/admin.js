const express = require("express");
const Admin = require("../models/Admin");
const Restaurant = require("../models/Restaurant");
const Reservation = require("../models/Reservation");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Middleware to protect admin routes
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Admin Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ 
      token,
      admin: {
        id: admin._id,
        username: admin.username
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify Token
router.get("/verify", protect, (req, res) => {
  res.json({ message: "Token is valid", admin: req.admin });
});

// Dashboard Stats
router.get("/stats", protect, async (req, res) => {
  try {
    const [restaurants, reservations, users, feedback] = await Promise.all([
      Restaurant.countDocuments(),
      Reservation.countDocuments(),
      User.countDocuments(),
      Feedback.countDocuments()
    ]);

    res.json({ restaurants, reservations, users, feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Restaurant CRUD Operations
router.get("/restaurants", protect, async (req, res) => {
  try {
    const restaurants = await Restaurant.find().sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/restaurants", protect, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/restaurants/:id", protect, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/restaurants/:id", protect, async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;