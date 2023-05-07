const mongoose = require("mongoose");
const slugify = require("slugify");

const HomePageSilderSchema = new mongoose.Schema(
  {
    Silderimages: [
      {
        url: {
          type: String,
        },
        altText: {
          type: String,
        },
      },
    ],

    slug: {
      type: String,
      require: [true, "slug didn't work"],
      unique: true,
    },

    bannderDetails: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },

    clientName: {
      type: String,
    },
  },
  { timestamps: true }
);

// slug the main category
HomePageSilderSchema.pre("save", function (next) {
  const timestamp = Date.now();
  const slug = slugify(this.clientName, {
    lower: false,
  });
  this.slug = `${slug}-${timestamp}`;
  next();
});

const HomePageSliders = mongoose.model("HomePageSliders", HomePageSilderSchema);

module.exports = HomePageSliders;
