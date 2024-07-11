import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageView = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get("http://localhost:4001/image/:id");
        setImage(response.data);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };
    fetchImage();
  }, []);

  return (
    <div>
      {image && (
        <img
          src={`data:image/jpeg;base64,${Buffer.from(image).toString(
            "base64"
          )}`}
          alt="Uploaded"
        />
      )}
    </div>
  );
};

export default ImageView;
