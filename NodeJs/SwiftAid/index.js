//#region imports

import express from "express";
import cors from "cors";
// import mongoose from "mongoose";
import APIRoutes from "./src/routes/index.js";
import bodyParser from "body-parser";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PORT } from "./ENV.js";
import "./src/helpers/init_mongodb.js";
import path from "path";

//#endregion

//#region constants

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = join(__dirname, "build", "index.html");

//#endregion

//#region middlewares

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// app.use((req, res, next) => {
//   console.log(req.path, req.method, req.body);
//   next();
// });

// Serve static files
app.use(express.static(path.join(__dirname, "build")));

// Define API routes
app.use("/api", APIRoutes);

// Error handling middleware for 404 errors
app.use("/api/*", (req, res, next) => {
  const err = new Error("Api Not Found");
  err.status = 404;
  next(err);
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Error handling middleware for other errors
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.json({
    error: err.message,
  });
});

//#endregion

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
