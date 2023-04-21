const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const Enquiry = require("../../models/Enquiry/EnquiryModel");
const SendEnquiry = require("../../models/Enquiry/SendEnquiry");

exports.CreateEnquiry = catchAsync(async (req, res, next) => {
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
  const allEnquiry = await Enquiry.find().populate({
    path: "getEnquiy",
  });

  res.status(200).json({
    status: "Success",
    allEnquiry,
  });
});

exports.sendEnquiryApi = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { EnquiryMessage } = req.body;
  const enquiredata = await Enquiry.findOne({ slug });
  const newRequest = new SendEnquiry({
    enquiryTo: enquiredata.enquiry,
    enquirySlug: slug,
    EnquiryMessage,
    user: req.user,
  });

  const createRequest = await newRequest.save();

  const requestEnquiry = await Enquiry.findOneAndUpdate(
    { slug },
    {
      $addToSet: { getEnquiy: createRequest._id },
    },
    {
      new: true,
    }
  );

  res.status(201).json({
    status: "Success",
    requestEnquiry,
  });
});

exports.getrequestDetails = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const requestDetails = await Enquiry.findOne({ slug }).populate({
    path: "getEnquiy",
    populate: {
      path: "user",
    },
  });

  res.status(201).json({
    status: "Success",
    requestDetails,
  });
});

// get all enquiry List by super Admin
exports.ListAllEnquiryRequest = catchAsync(async (req, res, next) => {
  const enqueiryRequest = await SendEnquiry.find();

  res.status(201).json({
    status: "Success",
    enqueiryRequest,
  });
});
