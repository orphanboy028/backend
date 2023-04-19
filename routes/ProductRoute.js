const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const productController = require("../controllers/users/ProductController");

// GET ALL PRODUCTS
router.get("/", productController.getAllProducts);

router.get("/single-product/:slug", productController.getSingleProduct);

// Midelwear for all business Routes
router.use(authController.protect, authController.restricTO("user"));

router.get("/user-products", productController.getUserProducts);

// Create Business API
router.post(
  "/create-Product",
  productController.productFeatureImage,
  productController.createProduct
);

router.get("/get-user-single-product", productController.getUserSingleProduct);

// UPDATE PRODUCT SPECIFICATON
router.patch(
  "/update-product-spacification",
  productController.updateProductSpacfification
);

module.exports = router;
