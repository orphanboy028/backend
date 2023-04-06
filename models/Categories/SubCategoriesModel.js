const mongoose = require("mongoose");
var slugify = require("slugify");

const subCategorySchema = mongoose.Schema({
  subCategoryName: {
    type: String,
    require: [true, "please Provide your name!"],
    unique: true,
  },

  slug: {
    type: String,
    require: [true, "slug didn't work"],
    unique: true,
  },

  descreption: {
    type: String,
  },

  SubcategoryImage: {
    type: String,
  },

  SubcategoryIcon: {
    type: String,
  },
  categorySlug: {
    type: String,
  },

  lefCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "LefCategories",
    },
  ],
});

// slug the sub-Category category
subCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.subCategoryName, {
    lower: false,
  });
  next();
});

//SubCategory Model
const SubCategory = mongoose.model("SubCategories", subCategorySchema);

module.exports = SubCategory;
