const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const BusinessController = require("../controllers/users/BusinessController");

// Get Business Details
router.get("/business-details/:slug", BusinessController.businessDetails);

// Midelwear for all business Routes
router.use(authController.protect, authController.restricTO("user"));

// Create Business API
router.post("/create-business", BusinessController.createBusiness);

router.get("/business-lists", BusinessController.getAllBusinessList);

// GET BUSINESS DETAILS API
router.get("/get-business-details", BusinessController.getUserBusinessDetails);

// Update Business Profile
router.patch(
  "/update-business-profile",
  BusinessController.updateBusinessProfile
);

// Update Company Logo
router
  .route("/update-logo")
  .patch(BusinessController.uploadCompanyLogo, BusinessController.updateLogo);

module.exports = router;
