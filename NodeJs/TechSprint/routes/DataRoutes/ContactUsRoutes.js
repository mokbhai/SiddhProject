import express from "express";
import {
  messageController,
  contactUsController,
} from "../../controllers/DataControllers/ContactUsController.js";
import userAuth from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", contactUsController.getAllContactUs);
router.delete("/:id", userAuth, contactUsController.deleteContactUs);
router.put("/:id", userAuth, contactUsController.updateContactUs);
router.post("/create", userAuth, contactUsController.createContactUs);

//#region Messages Routes

router.get("/message/filter", userAuth, messageController.filterMessages);
router.delete(
  "/message/:id",
  userAuth,
  messageController.deleteMessagePermanently
);
router.put("/message/:id", userAuth, messageController.updateMessage);
router.post("/message/create", messageController.createMesage);

//#endregion

export default router;
