import Restaurant from "../models/restaurant.js";

// @desc  Insert 10 restaurants
// @route POST /api/restaurants/seed
// @access Public
export const seedRestaurants = async (req, res) => {
    try {
        const restaurants = [
            { name: "Spicy Bites", location: "New Delhi", capacity: 50, cuisineType: "Indian", openingHours: "10 AM - 11 PM", contact: { phone: "9876543210", email: "contact@spicybites.com" } },
            { name: "Ocean Breeze", location: "Mumbai", capacity: 80, cuisineType: "Seafood", openingHours: "12 PM - 10 PM", contact: { phone: "9988776655", email: "info@oceanbreeze.com" } },
            { name: "Burger Haven", location: "Bangalore", capacity: 60, cuisineType: "Fast Food", openingHours: "9 AM - 12 AM", contact: { phone: "9898989898", email: "burger@haven.com" } },
            { name: "Pasta Fiesta", location: "Hyderabad", capacity: 40, cuisineType: "Italian", openingHours: "11 AM - 9 PM", contact: { phone: "9988665544", email: "info@pastafiesta.com" } },
            { name: "Royal Dine", location: "Chennai", capacity: 100, cuisineType: "Mughlai", openingHours: "12 PM - 11 PM", contact: { phone: "9786543210", email: "support@royaldine.com" } },
            { name: "Green Eats", location: "Pune", capacity: 30, cuisineType: "Vegan", openingHours: "10 AM - 8 PM", contact: { phone: "9966332211", email: "info@greeneats.com" } },
            { name: "Sushi Delight", location: "Kolkata", capacity: 70, cuisineType: "Japanese", openingHours: "1 PM - 10 PM", contact: { phone: "9654321789", email: "contact@sushidelight.com" } },
            { name: "Steak House", location: "Ahmedabad", capacity: 90, cuisineType: "Steakhouse", openingHours: "5 PM - 12 AM", contact: { phone: "9877654321", email: "info@steakhouse.com" } },
            { name: "Tandoori Treats", location: "Jaipur", capacity: 55, cuisineType: "North Indian", openingHours: "11 AM - 10 PM", contact: { phone: "9234567890", email: "support@tandooritreats.com" } },
            { name: "Dessert Heaven", location: "Lucknow", capacity: 45, cuisineType: "Bakery", openingHours: "10 AM - 8 PM", contact: { phone: "9123456789", email: "info@dessertheaven.com" } }
        ];

        await Restaurant.insertMany(restaurants);
        res.status(201).json({ message: "10 restaurants added successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error inserting restaurants", error: error.message });
    }
};

// @desc  Get all restaurants
// @route GET /api/restaurants
// @access Public
export const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: "Error fetching restaurants", error: error.message });
    }
};
