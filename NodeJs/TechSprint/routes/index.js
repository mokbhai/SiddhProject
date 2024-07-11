import express from "express";
import UserRoutes from "./UserRoutes.js";
import EventRoutes from "./EventRoutes.js";
import FileRoutes from "./FileRoutes.js";
import MailRoutes from "./MailRoutes.js";
import OtpRoutes from "./OtpRoutes.js";
import RegistrationRoutes from "./RegistrationRoutes.js";
import ContactUsRoutes from "./DataRoutes/ContactUsRoutes.js";
import {
  aboutusRouter,
  galleryRouter,
  socialMediaRouter,
} from "./DataRoutes/AboutUsRoutes.js";

const router = express.Router();

router.use("/user", UserRoutes);
router.use("/event", EventRoutes);
router.use("/file", FileRoutes);
router.use("/mail", MailRoutes);
router.use("/otp", OtpRoutes);
router.use("/registration", RegistrationRoutes);
router.use("/contactUs", ContactUsRoutes);
router.use("/aboutUs", aboutusRouter);
router.use("/gallery", galleryRouter);
router.use("/socialMedia", socialMediaRouter);

export default router;
