import express from "express";
import typeController from "../controllers/typeController.js";
const router = express.Router();
import multer from "multer";
const upload = multer();
router.post("/addType", upload.none(), typeController.addType);
router.get("/getTypes", upload.none(), typeController.getTypes);
export default router;
