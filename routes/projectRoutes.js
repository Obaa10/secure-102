import express from "express";
import { handShake,setUserSession,closeSession,setUserProjects } from "../controllers/projectController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate)
router.post("/handshake",handShake);
router.post("/set-user-session",setUserSession);
router.post("/add-project",setUserProjects);
router.post("/end-session",closeSession);

export default router;
