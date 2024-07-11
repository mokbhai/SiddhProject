import React, { useState } from "react";
import axios from "axios";

const ImageUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      await axios.post("http://localhost:4001/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div>
      <h2>Upload Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default ImageUploadForm;
