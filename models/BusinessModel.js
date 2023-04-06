const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema(
  {
    CompanyName: {
      type: String,
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
      type: String,
      require: [true, "Please Provide Business Owner id!"],
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

const Business = mongoose.model("Business", BusinessSchema);

module.exports = Business;
