const express = require("express");
const router = express.Router();
const authController = require("../../../controllers/authController");
const superAdminController = require("../../../controllers/superAdminController");
const BannerController = require("../../../controllers/BannersController/BaneersController");

// Midelwear for all business Routes
router.use(
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin")
);

// Upload Home Pagle Slider Banner
router.post(
  "/upload-home-page-slider-banner",
  BannerController.uploadHomePageSliderBanner,
  BannerController.UploadHomePageSlider
);

router.get("/home-slider-list", BannerController.getListHomeSliderBanner);

router.patch("/update-home-slider-status", BannerController.updateStatus);
router.patch(
  "/in-activate-home-slider-status",
  BannerController.InActivateStatus
);
module.exports = router;
