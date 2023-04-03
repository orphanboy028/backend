const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");

router.post("/super-admin-register", superAdminController.superAdminregister);
router.post("/login-super-admin", superAdminController.SuperAdminlogin);

module.exports = router;
