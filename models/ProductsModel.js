const mongoose = require("mongoose");
var slugify = require("slugify");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    require: [true, "slug didn't work"],
    unique: true,
  },
  images: [
    {
      url: {
        type: String,
      },
      altText: {
        type: String,
      },
    },
  ],
  imageGallery: [
    {
      url: {
        type: String,
        required: true,
      },
      altText: {
        type: String,
        required: true,
      },
    },
  ],
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
  },
  subCategory: {
    type: String,
  },
  lefCategory: {
    type: String,
  },
  properties: {
    type: mongoose.Schema.Types.Mixed,
  },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// slug the sub-Category category
productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    lower: false,
  });
  next();
});

// populate business
productSchema.pre(/^find/, function (next) {
  this.find().populate({
    path: "user",
  });
  next();
});

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
