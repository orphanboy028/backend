const mongoose = require("mongoose");
var slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "active",
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

    productMetas: {
      MetaDescription: {
        content: {
          type: String,
        },
        name: {
          type: String,

          default: "description",
        },
      },

      Metakeywords: {
        content: {
          type: String,
        },
        name: {
          type: String,
          default: "keywords",
        },
      },
    },
    ProductMetaog: {
      MetaOgTitle: {
        content: {
          type: String,
        },

        property: {
          type: String,
          default: "og:title",
        },
      },
      MetaOgDescription: {
        content: {
          type: String,
        },

        property: {
          type: String,
          default: "og:description",
        },
      },
      MetaOgImage: {
        content: {
          type: String,
        },

        property: {
          type: String,
          default: "og:image",
        },
      },
    },

    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
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
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    city: {
      type: String,
    },
    properties: {
      type: mongoose.Schema.Types.Mixed,
    },

    productEnquiries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

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

productSchema.pre("save", function (next) {
  if (
    this.name &&
    this.slug &&
    this.images.length &&
    this.description &&
    this.price &&
    this.unit
  ) {
    this.status = "active";
  } else {
    this.status = "pending";
  }
  next();
});

// productSchema.pre("findOneAndUpdate", async function (next) {
//   const product = await this.model.findOne(this.getQuery());
//   if (product && product.status !== "deactive") {
//     this.update({}, { status: "pending" });
//   }
//   next();
// });

const Products = mongoose.model("Products", productSchema);

module.exports = Products;
