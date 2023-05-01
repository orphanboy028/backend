const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const SuperAdmin = require("../models/SuperAdminModel");
const sendEmail = require("./../utils/email");
const User = require("../models/userModel");

const ALLOWED_EMAILS = [
  "sandeep@gmail.com",
  "pawan@gmail.com",
  "sanjay@gmail.com",
];

exports.superAdminregister = catchAsync(async (req, res, next) => {
  const { name, email, mobileNumber, password, passwordConfirm } = req.body;

  //   check the user input file isEmpity
  if ((!name || !email || !mobileNumber, !password, !passwordConfirm)) {
    return next(new AppError("Please Provide Required filed"));
  }

  if (!ALLOWED_EMAILS.includes(email)) {
    await sendEmail({
      email: "superadmin@gmail.com",
      subject: "some body try to register e-mail",
      message: `some body try to register as super admin by this ${email}`,
    });
    return next(new AppError("your email is not listed"));
  }
  //   Check the user limit
  const userCount = await SuperAdmin.countDocuments();

  if (userCount > 2) {
    await sendEmail({
      email: "superadmin@gmail.com",
      subject: "new Super Admin- register",
      message: `some body try to register as super admin by this ${email}`,
    });
    return next(new AppError("User limmit set no other user register"));
  }

  const checkUser = await SuperAdmin.findOne({ email });

  if (checkUser) {
    return next(new AppError("This Email already register"));
  }

  const newUser = await SuperAdmin.create({
    name,
    email,
    mobileNumber,
    password,
    isActive: true,
  });

  await sendEmail({
    email: email,
    subject: "Super Admin Registration",
    message: `Check your website new user Register as super Admin`,
  });

  res.status(200).json({
    status: "Success",
    newUser,
  });
});

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

exports.protectSuperAdmin = catchAsync(async (req, res, next) => {
  console.log("call super admin");
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
  const freshUser = await SuperAdmin.findById(decoded.id);

  if (!freshUser) {
    return next(
      new AppError("The Super Admin token does not blonging to this user", 401)
    );
  }
  // 4) check if user changed password
  // pendng....

  // Grant acces to Protected Route

  req.user = freshUser;
  next();
});

exports.SuperAdminlogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) check if email and password exist
  if (!email && !password) {
    return next(new AppError("Please Provide Email and Password"));
  }
  // 2) check if user exist && password is correct
  const user = await SuperAdmin.findOne({ email }).select("+password");
  // 3) if everythng ok, send token to client

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorect email or password", 401));
  }

  createSendToken(user, 200, res);
});

// get all new register user
exports.getAllUser = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();
  res.status(200).json({
    status: "Success",
    allUsers,
  });
});
