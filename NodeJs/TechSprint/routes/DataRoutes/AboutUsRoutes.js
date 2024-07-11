import express from "express";
import {
  aboutUsController,
  galleryController,
  mediaController,
  socialMediaController,
} from "../../controllers/DataControllers/AboutUsController.js";
import userAuth from "../../middlewares/authMiddleware.js";

const aboutusRouter = express.Router();
const socialMediaRouter = express.Router();
const galleryRouter = express.Router();

//#region About Us

const { createAboutUs, getAboutUs, deleteAboutUs } = aboutUsController;

aboutusRouter.get("/", getAboutUs);
aboutusRouter.delete("/", userAuth, deleteAboutUs);
aboutusRouter.post("/create", userAuth, createAboutUs);

//#endregion

//#region SocialMedia

const {
  createSocialMedia,
  getAllSocialMedia,
  updateSocialMedia,
  deleteSocialMedia,
} = socialMediaController;

socialMediaRouter.get("/SocialMedia/", getAllSocialMedia);
socialMediaRouter.delete("/SocialMedia/:id", userAuth, deleteSocialMedia);
socialMediaRouter.put("/SocialMedia/:id", userAuth, updateSocialMedia);
socialMediaRouter.post("/SocialMedia/create", userAuth, createSocialMedia);

//#endregion

//#region Gallery

const { createGallery, getAllGallery, deleteGallery } = galleryController;

galleryRouter.get("/", getAllGallery);
galleryRouter.delete("/:id", userAuth, deleteGallery);
// galleryRouter.put("/:id", userAuth, updateGallery);
galleryRouter.post("/create", userAuth, createGallery);

//#endregion

export { socialMediaRouter, galleryRouter, aboutusRouter };
