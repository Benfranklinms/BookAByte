/**
 * BookABite - Authentication Middleware
 *
 * This file contains middleware for authenticating users via JWT
 */

const jwt = require("jsonwebtoken")

/**
 * Middleware to authenticate JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticateToken = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" })
  }
}

module.exports = { authenticateToken }

