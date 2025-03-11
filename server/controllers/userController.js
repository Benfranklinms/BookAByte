import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.js";

// Secret Key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use environment variable

// 🛠 Signup Function
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new userModel({ name, email, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// 🛠 Login Function
export const login = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.method , req.url);

    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
