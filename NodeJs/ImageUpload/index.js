const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 5001;

// Connect to MongoDB
mongoose.connect("mongodb+srv://admin:admin@mernapp.xhdh1kh.mongodb.net/");

// Define image schema and model
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});
const Image = mongoose.model("Image", imageSchema);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Handle image upload
app.post("/upload", upload.single("image"), async (req, res) => {
  const { originalname, buffer, mimetype } = req.file;
  const newImage = new Image({
    name: originalname,
    data: buffer,
    contentType: mimetype,
  });
  await newImage.save();
  res.send("Image uploaded successfully");
});

// Serve uploaded image
app.get("/image/:id", async (req, res) => {
  const image = await Image.findById(req.params.id);
  res.contentType(image.contentType);
  res.send(image.data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
