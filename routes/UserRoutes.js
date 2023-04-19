const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const UserController = require("../controllers/users/UserConroller");

router.use(authController.protect, authController.restricTO("user"));
router.get("/get-all-users", UserController.getAllUsers);

module.exports = router;
