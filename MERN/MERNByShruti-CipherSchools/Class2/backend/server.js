const connectDB = require("./config/db.js");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

connectDB();

const PORT = process.env.PORT || 5001;

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.listen(PORT, console.log("Server running on " + PORT));
