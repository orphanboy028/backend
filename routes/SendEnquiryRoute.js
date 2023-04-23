const express = require("express");
const router = express.Router();
const FormController = require("../controllers/SuperAdmin/FormController");
const EnquiryController = require("../controllers/users/EnquiryController");
const superAdminController = require("../controllers/superAdminController");
const authController = require("../controllers/authController");

router.get(
  "/List-All-Enquiry-Request",
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin"),
  EnquiryController.ListAllEnquiryRequest
);

router.get(
  "/super-admin-get-request-details/:slug",
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin"),
  EnquiryController.getrequestDetails
);
router.use(authController.protect, authController.restricTO("user"));
router.post("/send-enquiry/:slug", EnquiryController.sendEnquiryApi);
router.get(
  "/get-request-details/:slug",
  authController.protect,
  authController.restricTO("user"),
  EnquiryController.getrequestDetails
);
module.exports = router;
