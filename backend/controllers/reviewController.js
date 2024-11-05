import Review from "../models/review.js";
import Story from "../models/story.js";

const addReview = async (req, res) => {
  const { storyId, fiveOutta, userId, desc, createdDate } = req.body;

  try {
    const newReview = new Review({
      storyId,
      fiveOutta,
      userId,
      desc,
      createdDate,
    });
    await newReview.save();
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $inc: { reviewCount: 1 } },
      { new: true, upsert: true }
    );
    res.status(201).json({
      message: "Review added surewrwerwerewfdsfdsfdsfdsccessfully",
      review: newReview,
      updatedStory,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateReview = async (req, res) => {
  const { reviewId, userID } = req.params;
  const { storyId, fiveOUtta, desc, createdDate } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        storyId,
        userID,
        desc,
        fiveOUtta,
        createdDate,
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getReviewsById = async (req, res) => {
  const { storyId } = req.params;
  try {
    const reviews = await Review.find({ storyId });
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export default { addReview, updateReview, getReviewsById };
