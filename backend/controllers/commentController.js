import Comment from "../models/comment.js";
import Story from "../models/story.js";

const addComment = async (req, res) => {
  const { storyId, userId, desc, createdDate } = req.body;

  try {
    const newComment = new Comment({
      storyId,
      userId,
      desc,
      createdDate,
    });
    await newComment.save();
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { $inc: { commentCount: 1 } },
      { new: true, upsert: true }
    );
    res.status(201).json({
      message: "Comment added successfully",
      comment: newComment,
      updatedStory,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateComment = async (req, res) => {
  const { commentId, userID } = req.params;
  const { storyId, desc, createdDate } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      {
        storyId,
        userID,
        desc,
        createdDate,
      },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCommentsById = async (req, res) => {
  const { storyId } = req.params;
  try {
    const comments = await Comment.find({ storyId });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default { addComment, getCommentsById, updateComment };
