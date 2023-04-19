const mongoose = require("mongoose");
const slugify = require("slugify");

const BusinessSchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
    },

    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },

    GstNumber: {
      type: String,
    },

    PanNumber: {
      type: String,
    },
    website: {
      type: String,
    },
    photo: {
      type: String,
    },
    BusiessOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide the Business Owner id!"],
    },
    address: {
      type: String,
    },
    NatureofBusiness: {
      type: String,
    },
    TotalNumberofEmployees: {
      type: String,
    },
    LegalStatusofFirm: {
      type: String,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
  },
  { timestamps: true }
);

// slug the main category
BusinessSchema.pre("save", function (next) {
  const timestamp = Date.now();
  const slug = slugify(this.CompanyName, {
    lower: false,
  });
  this.slug = `${slug}-${timestamp}`;
  next();
});

const Business = mongoose.model("Business", BusinessSchema);

module.exports = Business;
