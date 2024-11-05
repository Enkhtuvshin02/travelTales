import express from "express";
import multer from "multer";
import commentController from "../controllers/commentController.js";
const router = express.Router();
const upload = multer();
router.post("/addComment", upload.none(), commentController.addComment);
router.put("/updateComment", upload.none(), commentController.updateComment);
router.get(
  "/getComments/:storyId",
  upload.none(),
  commentController.getCommentsById
);
export default router;
