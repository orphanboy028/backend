const mongoose = require("mongoose");
var slugify = require("slugify");

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
    require: [true, "please Provide Categorie name!"],
    unique: true,
  },

  slug: {
    type: String,
    require: [true, "slug didn't work"],
    unique: true,
  },

  categoryImage: {
    type: String,
  },

  categoryIcon: {
    type: String,
  },

  subCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategories",
    },
  ],
});

// slug the main category
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.categoryName, {
    lower: false,
  });
  next();
});

// Category Model
const Categories = mongoose.model("Categories", categorySchema);

module.exports = Categories;
