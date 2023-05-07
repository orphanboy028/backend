const mongoose = require("mongoose");
const slugify = require("slugify");

const EnquirySchema = new mongoose.Schema(
  {
    enquiry: {
      type: String,
    },

    Seletedlefcategory: {
      type: String,
    },

    description: {
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

    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    getEnquiy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SendEnquiry",
      },
    ],
  },
  { timestamps: true }
);

// slug the main category
EnquirySchema.pre("save", function (next) {
  const timestamp = Date.now();
  const slug = slugify(this.enquiry, {
    lower: false,
  });
  this.slug = `${slug}-${timestamp}`;
  next();
});

// populate business
EnquirySchema.pre(/^find/, function (next) {
  this.find().populate({
    path: "user",
  });
  next();
});

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

module.exports = Enquiry;
