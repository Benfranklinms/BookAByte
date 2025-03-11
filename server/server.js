import express from "express";
import connectToDB from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";  
//import restaurantRoutes from "./routes/resturantRoutes.js";
dotenv.config();
connectToDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", userRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/payment", paymentRoutes);
//app.use("/restaurant", restaurantRoutes);
app.listen(3000, () => {
    console.log("server is running on port 3000");
});
