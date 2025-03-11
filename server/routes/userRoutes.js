import express from "express";
import { body, validationResult } from "express-validator";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

// Middleware for input validation
const validateSignup = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    },
];

const validateLogin = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    },
];

// 🛠 Routes
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);

export default router;
