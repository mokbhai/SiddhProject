import mongoose from "mongoose";
import STATUSCODE from "../Enums/HttpStatusCodes.js";

export const validateFields = (fields, next) => {
  fields.forEach((field) => {
    if (!field.field) {
      return sendError(STATUSCODE.BAD_REQUEST, field.message, next);
    }
  });
};

export const sendError = (statusCode, message, next) => {
  // console.log(message);
  const err = new Error(message);
  err.statusCode = statusCode;
  return next(err);
};

// check MongoId
export const isValidMongoId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};
