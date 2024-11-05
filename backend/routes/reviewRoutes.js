import express from "express";
import multer from "multer";
import reviewController from "../controllers/reviewController.js";
const router = express.Router();
const upload = multer();
router.post("/addReview", upload.none(), reviewController.addReview);
router.put("/updateReview", upload.none(), reviewController.updateReview);
router.get(
  "/getReviews/:storyId",
  upload.none(),
  reviewController.getReviewsById
);
export default router;
