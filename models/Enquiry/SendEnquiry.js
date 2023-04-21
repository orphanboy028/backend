const mongoose = require("mongoose");
const slugify = require("slugify");

const SendEnquirySchema = new mongoose.Schema(
  {
    enquiryTo: {
      type: String,
    },

    enquirySlug: {
      type: String,
    },

    EnquiryMessage: {
      type: String,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// slug the main category

const SendEnquiry = mongoose.model("SendEnquiry", SendEnquirySchema);

module.exports = SendEnquiry;
