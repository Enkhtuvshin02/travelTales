import Story from "../models/story.js";
import photoController from "../controllers/photoController.js";

const uploadStory = async (req, res) => {
  try {
    const { userId, title, description, createdDate, type, ...otherFields } =
      req.body;
    if (!req.files || !req.files["images"] || !req.files["thumbnail"]) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    const newStory = new Story({
      userId,
      title,
      type,
      description,
      createdDate,
      otherFields,
      thumbnailUrl: "",
    });

    await newStory.save();
    console.log(newStory);
    const { thumbnailUrl, photos } = await photoController.uploadStoryPhotos(
      newStory._id,
      req.files["images"],
      req.files["thumbnail"][0]
    );
    console.log("thumbnail url:" + thumbnailUrl);
    newStory.thumbnailUrl = thumbnailUrl;
    await newStory.save();
    console.log(newStory);
    return res.status(201).json({
      message: "Record created successfully",
      data: { ...newStory.toObject(), photos },
    });
  } catch (error) {
    console.error("Error creating record:", error);
    return res
      .status(500)
      .json({ message: "Error creating record", error: error.message });
  }
};

const getStoryById = async (req, res) => {
  const { storyId } = req.params;
  try {
    const story = await Story.find({ storyId });
    res.status(200).json(story);
  } catch (error) {
    console.error("Error fetching story:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllStory = async (req, res) => {
  try {
    const stories = await Story.find({});
    res.status(200).json(stories);
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default { uploadStory, getStoryById, getAllStory };
