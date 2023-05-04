const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const productController = require("../controllers/users/ProductController");
const superAdminController = require("../controllers/superAdminController");
const UsertrackUserActivity = require("../utils/TrackingMidelwear");

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

router.get("/single-product/:slug", productController.getSingleProduct);

router.get("/search", productController.getSearchProduct);

// Super ADMIN GET PRODUCT ENQUIRE
router.get(
  "/super-admin-product-Enquires",
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin"),
  productController.SuperAdminproductEnquires
);

// Midelwear for all business Routes
router.use(authController.protect, authController.restricTO("user"));

router.get(
  "/user-products",

  productController.getUserProducts
);

// Create Business API
router.post(
  "/create-Product",

  productController.productFeatureImage,
  productController.createProduct
);

router.get("/get-user-single-product", productController.getUserSingleProduct);

// UPDATE PRODUCT SPECIFICATON
router.patch(
  "/update-product-spacification/:slug",
  productController.updateProductSpacfification
);

// Update Only Product Image
router.patch(
  "/feature-image/update-product-image/:slug",
  productController.productFeatureImage,
  productController.updateOnlyProductImage
);

router.patch(
  "/update-prodcut-baise-details/:slug",
  productController.updateBiasieDetails
);

router.patch("/deactive-product", productController.deActivateProduct);
router.patch("/active-product", productController.ActivateProduct);
router.delete("/delete-product", productController.DeleteProduct);

router.patch(
  "/Send-Single-product-Enqiires/:slug",
  productController.SendSingleproductEnqiires
);

// GET PRODUCT Enquirey
router.get("/user-product-Enquires", productController.productEnquires);

// GET Single Product PRODUCT Enquirey
router.get(
  "/user-single-product-Enquires/:slug",
  productController.SingleproductEnquires
);

module.exports = router;
