import express from "express";
import { professorAddMarks } from "../controllers/marksController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate)
router.post("/add-marks",professorAddMarks);

export default router;
