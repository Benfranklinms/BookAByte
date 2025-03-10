import express from "express"
import connectToDB from "./config/db.js"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

dotenv.config();
connectToDB();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(3000, () => {
    console.log("server is running on port 3000");
});