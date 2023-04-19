const mongoose = require("mongoose");

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

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// populate business
EnquirySchema.pre(/^find/, function (next) {
  this.find().populate({
    path: "user",
  });
  next();
});

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

module.exports = Enquiry;
