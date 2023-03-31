const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("./../utils/email");
const RSA = require("node-rsa");

exports.register = catchAsync(async (req, res, next) => {
  const { name, email, mobileNumber, password, passwordConfirm } = req.body;
  //   check the user input file isEmpity
  if ((!name || !email || !mobileNumber, !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed"));
  }
  // check user email is Already Exist
  const checkUser = await User.findOne({ email });
  if (checkUser) {
    return next(new AppError("you have already account Please Login"));
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Encrypt OTP using RSA
  const key = new RSA({ b: 512 });
  const encryptedOtp = key.encrypt(otp, "base64");

  const newUser = await User.create({
    name,
    email,
    mobileNumber,
    password,
    otp: encryptedOtp,
    otpTimestamp: new Date(),
    isActive: false,
  });

  await sendEmail({
    email: email,
    subject: "This is Enqury from user",
    message: `<h1>This is your one Time password (OTP) ${otp} for registration please use OTP <h1>`,
  });

  res.status(200).json({
    status: "Success",
    otp,
    newUser,
  });
});
