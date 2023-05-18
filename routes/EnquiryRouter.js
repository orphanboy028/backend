const express = require("express");
const router = express.Router();
const FormController = require("../controllers/SuperAdmin/FormController");
const EnquiryController = require("../controllers/users/EnquiryController");
const superAdminController = require("../controllers/superAdminController");
const authController = require("../controllers/authController");

router.post(
  "/create-enquiry",
  authController.protect,
  authController.restricTO("user"),
  EnquiryController.CreateEnquiry
);

router.get(
  "/super-admin-get-all-enquiry",
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin"),
  EnquiryController.getAllEnquiry
);

router.use(authController.protect, authController.restricTO("user"));
router.get("/get-all-enquiry", EnquiryController.getAllEnquiry);
router.get(
  "/user-created-enquires-list",
  EnquiryController.ListOfCreatedEnquires
);

module.exports = router;
