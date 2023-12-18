const express = require("express");
const { contactController } = require("../controllers/contactController");
const router = express.Router();
const ContactController = new contactController();

router.route("/").get(ContactController.getContacts);

router.route("/").post(ContactController.createContact);

router.route("/:id").get(ContactController.getContact);

router.route("/:id").put(ContactController.updateContact);

router.route("/:id").delete(ContactController.deleteContact);

module.exports = router;