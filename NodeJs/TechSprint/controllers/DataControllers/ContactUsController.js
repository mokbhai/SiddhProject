import redisClient from "../../config/redis.js";
import STATUSCODE from "../../Enums/HttpStatusCodes.js";
import ContactUs, {
  MessageModel,
} from "../../models/DataModels/ContactUsModel.js";
import { validateFields, sendError, isValidMongoId } from "../ErrorHandler.js";
import { updateFileTill } from "../FilesController.js";

//#region Contact Us Controller

const createContactUs = async (req, res, next) => {
  try {
    const { fullname, phone, email, designation, photo } = req.body;
    validateFields(
      [
        { field: fullname, message: "Full name is required" },
        { field: phone, message: "Phone number is required" },
        { field: email, message: "Email Id is required" },
        { field: designation, message: "Designation is required" },
        { field: photo, message: "Photo Id is required" },
      ],
      next
    );
    const newContactUs = new ContactUs({
      fullname,
      phone,
      email,
      designation,
      photo,
    });
    await updateFileTill([photo], "ContactUs");
    const savedContactUs = await newContactUs.save();
    redisClient.del("ContactUs");
    return res.status(STATUSCODE.CREATED).json(savedContactUs);
  } catch (error) {
    next(error);
  }
};

const getAllContactUs = async (req, res, next) => {
  redisClient.get("ContactUs", async (err, redisContactUs) => {
    if (err) {
      return next(err);
    }

    if (redisContactUs) {
      return res.status(STATUSCODE.OK).json(JSON.parse(redisContactUs));
    } else {
      try {
        const data = await ContactUs.find({ isDeleted: false });
        console.log(data);
        if (!data) {
          return sendError(STATUSCODE.NOT_FOUND, "No Contact found", next);
        }

        redisClient.set("ContactUs", JSON.stringify(data));

        return res.status(STATUSCODE.OK).json(data);
      } catch (error) {
        return next(error);
      }
    }
  });
};

const updateContactUs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullname, phone, email, designation, photo } = req.body;
    validateFields(
      [
        { field: fullname, message: "Full name is required" },
        { field: phone, message: "Phone number is required" },
        { field: email, message: "Email Id is required" },
        { field: designation, message: "Designation is required" },
        { field: photo, message: "Photo is required" },
      ],
      next
    );

    const contactUs = await ContactUs.findById(id);
    await updateFileTill([contactUs.photo], "ContactUs", "Temprary");
    await updateFileTill([photo], "ContactUs");

    const updatedContactUs = await ContactUs.findByIdAndUpdate(
      id,
      { fullname, phone, email, designation, photo },
      { new: true }
    );
    if (!updatedContactUs) {
      return sendError(STATUSCODE.NOT_FOUND, "Contact not found", next);
    }
    redisClient.del("ContactUs");
    return res.status(STATUSCODE.OK).json(updatedContactUs);
  } catch (error) {
    next(error);
  }
};

const deleteContactUs = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContactUs = await ContactUs.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedContactUs) {
      return sendError(STATUSCODE.NOT_FOUND, "Contact not found", next);
    }
    redisClient.del("ContactUs");
    return res.status(STATUSCODE.OK).json(deletedContactUs);
  } catch (error) {
    next(error);
  }
};

export const contactUsController = {
  createContactUs,
  getAllContactUs,
  updateContactUs,
  deleteContactUs,
};

//#endregion

//#region Message Controller

const createMesage = async (req, res, next) => {
  try {
    const { phone, email, message } = req.body;
    validateFields(
      [
        { field: phone, message: "Phone number is required" },
        { field: email, message: "Email Id is required" },
        { field: message, message: "Message is required" },
      ],
      next
    );
    const data = new MessageModel({
      phone,
      email,
      message,
    });

    const result = await data.save();

    if (!result) {
      return sendError(STATUSCODE.BAD_REQUEST, "Message not saved", next);
    }

    return res
      .status(STATUSCODE.CREATED)
      .json({ success: true, message: "Message Saved" });
  } catch (error) {
    next(error);
  }
};

const filterMessages = async (req, res, next) => {
  try {
    const { isReaded, isDeleted, type, date } = req.query;

    let filter = {};

    if (isReaded !== undefined) {
      filter.isReaded = isReaded === "true";
    }

    if (isDeleted !== undefined) {
      filter.isDeleted = isDeleted === "true";
    }

    if (type) {
      filter.type = type;
    }

    // Add date filter
    if (date) {
      filter.date = new Date(date);
    }

    const messages = await MessageModel.find(filter);

    if (messages == []) {
      return res
        .status(STATUSCODE.NO_CONTENT)
        .json({ messages: "No Messages Found for filter", filter });
    }

    return res.status(STATUSCODE.OK).json(messages);
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { isReaded, isDeleted } = req.body;

    if (!isValidMongoId(id)) {
      return sendError(STATUSCODE.BAD_REQUEST, "Message Id is not valid", next);
    }

    const data = await MessageModel.findById(id);

    if (!data) {
      return sendError(STATUSCODE.NOT_FOUND, "Message not found", next);
    }

    if (isReaded == undefined) {
      isReaded = data.isReaded;
    }

    if (isDeleted == undefined) {
      isReaded = data.isDeleted;
    }

    const result = await data.save();

    return res.status(STATUSCODE.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteMessagePermanently = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMessage = await MessageModel.findByIdAndDelete(id);
    if (!deletedMessage) {
      return sendError(STATUSCODE.NOT_FOUND, "Message not found", next);
    }
    return res.status(STATUSCODE.OK).json(deleteMessage);
  } catch (error) {
    next(error);
  }
};

export const messageController = {
  createMesage,
  filterMessages,
  updateMessage,
  deleteMessagePermanently,
};

//#endregion
