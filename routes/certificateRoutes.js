import express from "express";
import {generateServerCertificate} from './../controllers/certificate/serverCertificate.js'
import {generateCSR} from './../controllers/certificate/testCertificateGenerator.js'
import {verifyCSR} from './../controllers/certificate/verifyCertificate.js'
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.use(authenticate);
router.post("/generate-csr", generateCSR);
router.post("/generate-server-csr", generateServerCertificate);
router.post("/verify-csr", verifyCSR);

export default router;
