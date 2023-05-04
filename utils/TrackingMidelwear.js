const UserActivity = require("../models/UserActivityModel");

const UsertrackUserActivity = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    // User is not logged in, don't track
    console.log("not Loggied");
    return next();
  }

  // Get user details from session
  const userId = req.session.userId;

  // Get request details
  console.log("userId", userId);
  const { originalUrl } = req;

  // Create user activity object
  const userActivitys = new UserActivity({
    userId,
    url: originalUrl,
  });

  // Save user activity to database
  userActivitys
    .save()
    .then(() => {
      console.log("User activity saved to database");
      next();
    })
    .catch((err) => {
      console.error("Error saving user activity to database:", err);
      next();
    });
};

module.exports = UsertrackUserActivity;
