import multer from "multer";
import path from "path";
import File from "../models/FilesModel.js";
import mongoose, { Mongoose } from "mongoose";
import fs from "fs";
import STATUSCODE from "../Enums/HttpStatusCodes.js";
import { sendError } from "./ErrorHandler.js";
import redisClient from "../config/redis.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./uploads";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.split(".").pop();
    const uniqueSuffix = Date.now() + "-" + extension;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage }).single("upload");

export const uploadFile = async (req, res, next) => {
  const { userId } = req.user;

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
    } else if (err) {
      return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
    }

    // Update the file data in MongoDB
    if (!req.file) {
      return sendError(STATUSCODE.BAD_REQUEST, "Didn't get File", next);
    }

    const { filename, mimetype, path } = req.file;
    const { length, width } = req.body;

    const fileData = new File();

    fileData.name = filename;
    fileData.type = mimetype;
    fileData.file = path;
    fileData.uplodedBy = userId;

    // If the file is an image
    // if (mimetype.startsWith("image/")) {
    // const image = path;

    // const webpImage = await imageToWebp(image, 40);
    // console.log(webpImage);

    // fs.copyFileSync(webpImage, image + ".webp");
    // fs.unlinkSync(image);

    // fileData.name = filename + ".webp";
    // fileData.type = "image/webp";
    // fileData.file = path + ".webp";

    //   if (length) {
    //     fileData.length = length;
    //   }
    //   if (width) {
    //     fileData.width = width;
    //   }
    // }

    await fileData
      .save()
      .then((result) => {
        // Store data in cache for future use
        redisClient.set(
          "file:" + result._id.toString(),
          JSON.stringify(result)
        ); // Set expiry to 10 minutes
        res.status(200).json({
          message: "File uploaded successfully",
          file: result,
          fileId: result._id,
        });
      })
      .catch((err) => {
        return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
      });
  });
};

export const changeFile = async (req, res, next) => {
  const { userId } = req.user;
  const { fileId, width, length } = req.body;

  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
    } else if (err) {
      return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
    }

    // Update the file data in MongoDB
    const { filename, mimetype, path } = req.file;

    const fileData = await File.findById(fileId);
    fileData.name = filename;
    fileData.type = mimetype;
    fileData.file = path;
    fileData.uplodedBy = userId;

    if (length) {
      fileData.length = length;
    }
    if (width) {
      fileData.width = width;
    }

    await fileData
      .save()
      .then((result) => {
        // Update data in cache
        redisClient.set("file:" + fileId, JSON.stringify(result));
        res.status(200).json({
          message: "File uploaded successfully",
          file: result,
          fileId: result._id,
        });
      })
      .catch((err) => {
        return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
      });
  });
};

export const downloadFile = async (req, res, next) => {
  const fileId = req.params.id;

  // Check if data is in cache
  await redisClient.get("file:" + fileId, async (err, result) => {
    if (result) {
      // If data is in cache, send it
      const file = JSON.parse(result);
      res.set({
        "Content-Type": file.type,
        "Content-Disposition": "attachment; filename=" + file.name,
      });
      fs.createReadStream(file.file).pipe(res);
    } else {
      // If data is not in cache, fetch it from the database
      await File.findById(fileId)
        .then(async (file) => {
          // Store data in cache for future use
          await redisClient.set("file:" + fileId, JSON.stringify(file));
          res.set({
            "Content-Type": file.type,
            "Content-Disposition": "attachment; filename=" + file.name,
          });
          fs.createReadStream(file.file).pipe(res);
        })
        .catch((err) => {
          return sendError(STATUSCODE.INTERNAL_SERVER_ERROR, err, next);
        });
    }
  });
};

export const viewFile = async (req, res, next) => {
  const fileId = req.params.id;
  if (!mongoose.isValidObjectId(fileId)) {
    return sendError(STATUSCODE.BAD_REQUEST, "Invalid File Id", next);
  }
  try {
    // Check if data is in cache
    await redisClient.get("file:" + fileId, async (err, result) => {
      if (result) {
        // If data is in cache, send it
        const file = JSON.parse(result);
        if (!file || file === null || file === undefined || !file.file)
          return sendError(STATUSCODE.NOT_FOUND, "File not found", next);

        // Redirect to the file path
        res.redirect(`/${file.file}?length=${file.length}&width=${file.width}`);
      } else {
        // If data is not in cache, fetch it from the database
        const file = await File.findById(fileId);
        // Store data in cache for future use
        if (!file || file === null || file === undefined || !file.file)
          return sendError(STATUSCODE.NOT_FOUND, "File not found", next);

        redisClient.set("file:" + fileId, JSON.stringify(file));
        // Redirect to the file path
        res.redirect(`/${file.file}`);
      }
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const fileId = req.params.id;

    if (!mongoose.isValidObjectId(fileId)) {
      return sendError(STATUSCODE.BAD_REQUEST, "File Id is not correct", next);
    }

    // deleteTempFiles();

    const file = await File.findByIdAndDelete(fileId);

    fs.unlinkSync(file.file);

    redisClient.del("file:" + fileId);

    return res
      .status(STATUSCODE.OK)
      .send({ success: true, message: "File Deleted" });
  } catch (err) {
    return sendError(
      STATUSCODE.INTERNAL_SERVER_ERROR,
      "File Not Deleted\n" + err,
      next
    );
  }
};

export const deleteTempFiles = async (req, res) => {
  const files = await File.find({ till: "Temprary" });

  for (let file of files) {
    // Delete file from filesystem
    try {
      fs.unlinkSync(file.file);
    } catch (error) {}

    // Delete file reference from MongoDB
    await File.deleteOne({ _id: file._id });
    redisClient.del("file:" + JSON.stringify(id));
  }
};

export const updateFileTill = async (ids, used = "", till = "Permanent") => {
  ids.forEach(async (id) => {
    try {
      const result = await File.findById(id);
      if (used && used !== "") result.used = used;
      result.till = till;
      await result.save();
      redisClient.del("file:" + JSON.stringify(id));
    } catch (error) {
      console.log(error);
    }
  });
};
