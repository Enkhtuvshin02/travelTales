import React, { useState } from "react";
// import axiosInstance from "../axios/axiosInstance.js";

const createStory = () => {
  const [singleImage, setSingleImage] = useState(null); // For one photo
  const [multipleImages, setMultipleImages] = useState([]); // For multiple photos

  // Handle a single photo upload
  const handleSingleImageChange = (e) => {
    const file = e.target.files[0]; // Only one file
    if (file && file.type.startsWith("image/")) {
      setSingleImage(URL.createObjectURL(file)); // Preview the image
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Handle multiple photos upload
  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files); // Convert file list to array
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    if (validImages.length) {
      const imagePreviews = validImages.map((file) =>
        URL.createObjectURL(file)
      );
      setMultipleImages(imagePreviews); // Preview multiple images
    } else {
      alert("Please select valid image files.");
    }
  };

  return (
    <div>
      {/* Single image input */}
      <h3>Select a single image</h3>
      <input type="file" accept="image/*" onChange={handleSingleImageChange} />
      {singleImage && (
        <div>
          <h4>Selected Image Preview:</h4>
          <img
            src={singleImage}
            alt="Selected"
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}

      <hr />

      {/* Multiple images input */}
      <h3>Select multiple images</h3>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleMultipleImagesChange}
      />
      {multipleImages.length > 0 && (
        <div>
          <h4>Selected Images Preview:</h4>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {multipleImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Selected ${index}`}
                style={{ width: 100, height: 100, margin: "5px" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default createStory;
