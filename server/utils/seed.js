/**
 * BookABite - Database Seeder
 *
 * This file contains utility functions to seed the database with initial data
 */

const User = require("../models/User")
const Restaurant = require("../models/Restaurant")
const Feedback = require("../models/Feedback")

/**
 * Seed the database with initial data
 */
const seedDatabase = async () => {
  try {
    // Check if we need to seed (only seed if collections are empty)
    const userCount = await User.countDocuments()
    const restaurantCount = await Restaurant.countDocuments()

    if (userCount > 0 && restaurantCount > 0) {
      console.log("Database already seeded")
      return
    }

    console.log("Seeding database...")

    // Create admin user if none exists
    if (userCount === 0) {
      const adminUser = new User({
        username: "admin",
        password: "admin123", // Will be hashed by pre-save hook
        email: "admin@bookabite.com",
        firstName: "Admin",
        lastName: "User",
      })

      await adminUser.save()
      console.log("Admin user created")
    }

    // Create restaurants if none exist
    if (restaurantCount === 0) {
      const restaurants = [
        {
          name: "The Italian Place",
          cuisine: "Italian",
          image:
            "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          description: "Authentic Italian cuisine in a cozy atmosphere.",
          rating: 4.8,
        },
        {
          name: "Sushi Master",
          cuisine: "Japanese",
          image:
            "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c3VzaGl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
          description: "Premium sushi and Japanese dishes made with fresh ingredients.",
          rating: 4.7,
        },
        {
          name: "Burger Joint",
          cuisine: "American",
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
          description: "Juicy burgers and crispy fries in a casual setting.",
          rating: 4.5,
        },
        {
          name: "Taco Fiesta",
          cuisine: "Mexican",
          image:
            "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGFjb3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          description: "Authentic Mexican tacos and refreshing margaritas.",
          rating: 4.6,
        },
        {
          name: "The Steakhouse",
          cuisine: "Steakhouse",
          image:
            "https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60",
          description: "Premium steaks cooked to perfection with auth",
          rating: 4.9,
        },
        {
          name: "Seafood Harbor",
          cuisine: "Seafood",
          image:
            "https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VhZm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          description: "Fresh seafood with a beautiful waterfront view.",
          rating: 4.7,
        },
      ]

      await Restaurant.insertMany(restaurants)
      console.log("Sample restaurants created")

      // Create sample feedback
      const createdRestaurants = await Restaurant.find()

      const feedback = [
        {
          restaurantId: createdRestaurants[0]._id,
          name: "John Smith",
          email: "john@example.com",
          rating: 5,
          message: "Great service and delicious food! Will definitely come back.",
          recommend: true,
        },
        {
          restaurantId: createdRestaurants[1]._id,
          name: "Emily Johnson",
          email: "emily@example.com",
          rating: 4,
          message: "The sushi was fresh and the service was excellent. Highly recommend!",
          recommend: true,
        },
        {
          restaurantId: createdRestaurants[2]._id,
          name: "Michael Brown",
          email: "michael@example.com",
          rating: 5,
          message: "Best burgers in town! The fries are also amazing.",
          recommend: true,
        },
      ]

      await Feedback.insertMany(feedback)
      console.log("Sample feedback created")
    }

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

module.exports = { seedDatabase }

