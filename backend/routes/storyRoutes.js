import express from "express";
import multer from "multer";
import storyController from "../controllers/storyController.js";
const upload = multer({ dest: "uploads/" });
const router = express.Router();
router.post(
  "/upload",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  storyController.uploadStory
);
router.get("/:storyId", storyController.getStoryById);
router.get("/getAll", storyController.getAllStory);
export default router;
