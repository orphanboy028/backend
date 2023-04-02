const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const SuperAdmin = require("../models/SuperAdminModel");
const sendEmail = require("./../utils/email");

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
