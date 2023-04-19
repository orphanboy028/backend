const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const User = require("../../models/userModel");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  res.status(200).json({
    status: "Success",
    allUsers,
  });
});
