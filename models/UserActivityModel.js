const mongoose = require("mongoose");

const UserActivitytrackingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  url: {
    type: String,
  },
  userAgent: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserActivity = mongoose.model("UserActivity", UserActivitytrackingSchema);

module.exports = UserActivity;
