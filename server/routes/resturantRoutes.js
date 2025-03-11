import express from "express";
import { seedRestaurants, getRestaurants } from "../controllers/resturantController.js";

const router = express.Router();

// Routes
router.post("/seed", seedRestaurants); // Add 10 restaurants
router.get("/get-restaurant", getRestaurants); // Fetch all restaurants

export default router;
