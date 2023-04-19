const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const Enquiry = require("../../models/EnquiryModel");

exports.sendEnquiry = catchAsync(async (req, res, next) => {
  const { enquiry, Seletedlefcategory, description } = req.body;
  const newEnquiry = await Enquiry.create({
    enquiry,
    Seletedlefcategory,
    description,
    user: req.user,
  });

  res.status(200).json({
    status: "Success",
    newEnquiry,
  });
});

exports.getAllEnquiry = catchAsync(async (req, res, next) => {
  const allEnquiry = await Enquiry.find();

  res.status(200).json({
    status: "Success",
    allEnquiry,
  });
});
