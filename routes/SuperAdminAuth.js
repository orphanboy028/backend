const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");
const authController = require("../controllers/authController");

router.post("/super-admin-register", superAdminController.superAdminregister);
router.post("/login-super-admin", superAdminController.SuperAdminlogin);

// restics routes midelwear for super-admin
router.use(
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin")
);

// GET ALL USERS
router.get("/all-users", superAdminController.getAllUser);

module.exports = router;
