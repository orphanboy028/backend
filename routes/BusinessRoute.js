const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const BusinessController = require("../controllers/users/BusinessController");

// Midelwear for all business Routes
router.use(authController.protect, authController.restricTO("user"));

// Create Business API
router.post("/create-business", BusinessController.createBusiness);

// GET BUSINESS DETAILS API
router.get("/get-business-details", BusinessController.getUserBusinessDetails);

// Update Business Profile
router.patch(
  "/update-business-profile",
  BusinessController.updateBusinessProfile
);

module.exports = router;
