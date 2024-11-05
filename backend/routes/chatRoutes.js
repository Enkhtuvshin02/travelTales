import express from "express";
import multer from "multer";
import chatController from "../controllers/chatController.js";
const router = express.Router();
const upload = multer();
router.get(
  "/getChatMessages/:chatId/:userId",
  upload.none(),
  chatController.getChatMessages
);
router.put("/chatRead/:chatId", upload.none(), chatController.chatRead);

export default router;
