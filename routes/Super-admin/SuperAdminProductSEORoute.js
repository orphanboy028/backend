const express = require("express");
const router = express.Router();
const SEOController = require("../../controllers/SEOController");
const superAdminController = require("../../controllers/superAdminController");

router.patch(
  "/Update-Product-Meta-Descreption/:slug",
  superAdminController.protectSuperAdmin,
  SEOController.UpdateProductMetaDescreption
);

router.patch(
  "/Update-Product-Meta-keywords/:slug",
  superAdminController.protectSuperAdmin,
  SEOController.UpdateProductKeywords
);

router.patch(
  "/Update-Product-og-title/:slug",
  superAdminController.protectSuperAdmin,
  SEOController.UpdateMetaOgTitle
);

router.patch(
  "/Update-Product-og-description/:slug",
  superAdminController.protectSuperAdmin,
  SEOController.UpdateMetaOgDescription
);

module.exports = router;
