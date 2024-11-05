import dotenv from "dotenv";

dotenv.config();
import Photo from "../models/photo.js";
import ProfilePic from "../models/profilePic.js";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dlfp8ly4b",
  api_key: "273678599278427",
  api_secret: "fHi2e_KqMHLEg9KdZtAfDiHGo6g",
});

const uploadStoryPhotos = async (storyId, images, thumbnail) => {
  try {
    const uploadedPhotos = [];

    if (images && images.length > 0) {
      const imageUploadPromises = images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.path, {
          folder: "stories",
        });

        const newPhoto = new Photo({
          storyId,
          imageUrl: result.secure_url,
        });

        await newPhoto.save();
        uploadedPhotos.push(newPhoto);
      });

      await Promise.all(imageUploadPromises);
    }

    let thumbnailUrl = "";
    if (thumbnail) {
      const result = await cloudinary.uploader.upload(thumbnail.path, {
        folder: "stories/thumbnails",
      });
      thumbnailUrl = result.secure_url;
    }

    return { thumbnailUrl, photos: uploadedPhotos };
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw new Error("Error uploading photos");
  }
};
const uploadProfilePic = async (userId, profilePic) => {
  try {
    const result = await cloudinary.uploader.upload(profilePic.path, {
      folder: "profiles",
    });
    const newProfilePic = new ProfilePic({
      userId,
      imageUrl: result.secure_url,
    });
    await newProfilePic.save();
    return newProfilePic.imageUrl;
  } catch (error) {
    console.error("Error uploading profile pic:", error);
    throw new Error("Error uploading profile pic");
  }
};

export default { uploadStoryPhotos, uploadProfilePic };
