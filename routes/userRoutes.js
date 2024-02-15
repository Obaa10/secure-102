///ANSWER OF THE FIRST QUESTION

import express from "express";
import { signup, login } from "../controllers/userController.js";

const router = express.Router();

// Signup API
router.post("/signup", signup);

// Login API
router.post("/login", login);

export default router;
