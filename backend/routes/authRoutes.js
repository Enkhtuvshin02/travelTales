import express from "express";
import multer from "multer";
import authController from "../controllers/authController.js";
const router = express.Router();
const upload = multer();
router.post("/signIn", upload.none(), authController.signIn);
router.post("/googleSignIn", upload.none(), authController.googleSignIn);
export default router;
