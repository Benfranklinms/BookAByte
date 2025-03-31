/**
 * BookABite - Database Configuration
 *
 * This file handles the connection to MongoDB
 */

const mongoose = require("mongoose")

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bookabite", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)

    // Call seed function if needed
    const { seedDatabase } = require("../utils/seed")
    await seedDatabase()
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB

