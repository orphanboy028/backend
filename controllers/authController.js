const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("./../utils/email");
const bcrypt = require("bcryptjs");
const RSA = require("node-rsa");
const crypto = require("crypto");

const HashOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOtp = await bcrypt.hash(otp, 12);
  return {
    otp,
    encryptedOtp,
  };
};

// Register User
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, mobileNumber, password, passwordConfirm } = req.body;

  //   check the user input file isEmpity
  if ((!name || !email || !mobileNumber, !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed"));
  }
  // check user email is Already Exist
  const checkUser = await User.findOne({ email });

  if (!checkUser) {
    // Generate OTP
    const { otp, encryptedOtp } = await HashOTP();
    // Generate Url String for OTP

    const UrlToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(UrlToken)
      .digest("hex");

    const newUser = await User.create({
      name,
      email,
      mobileNumber,
      password,
      otp: encryptedOtp,
      otpTimestamp: new Date(),
      otpgenerateToken: hashedToken,
      isActive: false,
    });

    await sendEmail({
      email: email,
      subject: "User Registration",
      message: `<h1>This is your one Time  (OTP) ${otp} for registration please use OTP <h1>`,
    });

    res.status(200).json({
      status: "Success",
      otp,
      newUser,
      UrlToken,
    });
  } else if (checkUser.isActive === true) {
    return next(new AppError("you have already account Please Login"));
  } else if (checkUser.isActive === false) {
    // Generate OTP
    const { otp, encryptedOtp } = await HashOTP();
    (checkUser.otp = encryptedOtp),
      (checkUser.otpTimestamp = new Date()),
      (checkUser.isActive = false),
      await checkUser.save();
    await sendEmail({
      email: email,
      subject: "User Registration",
      message: `<h1>This is your one Time  (OTP) ${otp} for registration please use OTP <h1>`,
    });

    res.status(200).json({
      status: "Success",
      otp,
      checkUser,
      UrlToken,
    });
  }
});

// Verify OTP and activate user's account
exports.verifyOtp = catchAsync(async (req, res, next) => {
  // 1 1) Get user based on the UrlToken
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2) Get the user by hashedToken
  const user = await User.findOne({ otpgenerateToken: hashedToken });
  // Verify OTP and expiration time
  const currentTime = new Date();

  if (
    (await bcrypt.compare(req.body.otp, user.otp)) &&
    currentTime.getTime() - user.otpTimestamp.getTime() <= 600000
  ) {
    user.otp = undefined;
    user.otpgenerateToken = undefined;
    user.isActive = true;
    await user.save();

    res.status(200).json({
      status: "Success",
      message: "your Registration sucesfully",
    });
  } else {
    return next(new AppError("Invalid OTP or expired. Please try again."));
  }
});
