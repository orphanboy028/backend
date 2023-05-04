const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const sendEmail = require("./../utils/email");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const HashOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const encryptedOtp = await bcrypt.hash(otp, 12);
  return {
    otp,
    encryptedOtp,
  };
};

// create tooken
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "Success",
    token,
    user,
  });
};

// jwt tooken function
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
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

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email && !password) {
    return next(new AppError("Please Provide Email and Password"));
  }
  // 2) check if user exist && password is correct
  const user = await User.findOne({ email }).select("+password");
  // 3) if everythng ok, send token to client

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log("call user");
  // 1) Getting token and
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError("Your are not logIn Please login to acces"), 401);
  }

  // 2) Verifing Tooken
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) check if user exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The User token does not blonging to this user", 401)
    );
  }
  // 4) check if user changed password
  // pendng....

  // Grant acces to Protected Route

  req.user = freshUser;
  next();
});

exports.restricTO = (...roles) => {
  return (req, res, next) => {
    // roles in Array
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to acces this", 403)
      );
    }

    next();
  };
};
