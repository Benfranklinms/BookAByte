import express from "express";
const router = express.Router();
import userModel from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from 'express-validator';

router.get("/", (req, res) => {
    res.render("login");
});
