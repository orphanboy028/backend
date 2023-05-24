const express = require("express");
const router = express.Router();
const superAdminController = require("../controllers/superAdminController");
const authController = require("../controllers/authController");
const categoriesController = require("../controllers/SuperAdmin/CategoriesController");

// GET ALL CATEGORIES
router.get("/get-all-categories", categoriesController.getAllCategories);
router.get("/get-all-sub-categories", categoriesController.getAllSubCategories);
router.get(
  "/get-main-subcategories-list/:catSlug",
  categoriesController.getSubCategoriesByMainCategories
);

router.get(
  "/get-sub-lef-categories/:subcategoryslug",
  categoriesController.getAllLeafCatgories
);

// Midelwear for only user for Super Admin
router.use(
  superAdminController.protectSuperAdmin,
  authController.restricTO("Super-admin")
);

// Create,  delete main categorie
router
  .route("/main-categorie")
  .post(
    categoriesController.uploadCategoriesImage,
    categoriesController.createCategory
  )
  .delete(categoriesController.deleteMainCategory);

// Create subcategories
router
  .route("/sub-categorie/:categorySlug")
  .post(
    categoriesController.uploadSubCategoriesImage,
    categoriesController.createSubCategory
  )
  .patch(categoriesController.addSubCategories);

// Delete Sub-Categories
router.delete("/delete-sub-categories", categoriesController.deleteSubCategory);

// Create lef-categories
router
  .route("/lef-categories/:subcategoryslug")
  .post(
    categoriesController.uploadLefCategoriesImage,
    categoriesController.createLeafCategory
  )
  .patch(categoriesController.addLefCategories)
  .get(categoriesController.getAllLeafCatgories);

module.exports = router;
