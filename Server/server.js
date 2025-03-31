/**
 * BookABite - Server Entry Point
 *
 * This is the main server file that initializes the Express application
 * and connects all the routes and middleware
 */

const express = require("express")
const cors = require("cors")
const path = require("path")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth")
const restaurantRoutes = require("./routes/restaurants")
const reservationRoutes = require("./routes/reservations")
const feedbackRoutes = require("./routes/feedback")

// Import database connection
const connectDB = require("./config/db")

// Initialize express app
const app = express()

// Connect to database
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, "../frontend")))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/restaurants", restaurantRoutes)
app.use("/api/reservations", reservationRoutes)
app.use("/api/feedback", feedbackRoutes)

// Root route
app.get("/api", (req, res) => {
  res.json({ message: "BookABite API is running" })
})

// Catch-all route to serve the frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

const adminRoutes = require("./routes/admin");

// Add admin routes
app.use('/api/admin', adminRoutes);

// Create first admin if none exists
const createFirstAdmin = async () => {
  const Admin = require('./models/Admin');
  const adminCount = await Admin.countDocuments();
  
  if (adminCount === 0) {
    const admin = new Admin({
      username: 'admin',
      password: 'admin123' // Will be hashed automatically
    });
    await admin.save();
    console.log('Default admin created:', admin.username);
  }
};
createFirstAdmin();

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

