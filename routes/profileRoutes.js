///ANSWER OF THE SECOND QUESTION

import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate).route("/").get(getProfile).post(updateProfile);

export default router;
