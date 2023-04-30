const express = require("express");
const router = express.Router();
const emailTemplateView = require("../controllers/emailTemplatesView/emailTemplateView");

router.get("/", emailTemplateView.getOverview);

module.exports = router;
