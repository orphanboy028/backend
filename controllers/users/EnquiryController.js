const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const Enquiry = require("../../models/Enquiry/EnquiryModel");
const SendEnquiry = require("../../models/Enquiry/SendEnquiry");

// Create Enquire From Form
exports.CreateEnquiry = catchAsync(async (req, res, next) => {
  const { enquiry, Seletedlefcategory, description, state } = req.body;
  const newEnquiry = await Enquiry.create({
    enquiry,
    Seletedlefcategory,
    description,
    city: req.user.businessDetails.city,
    state: req.user.businessDetails.state,
    district: req.user.businessDetails.district,
    user: req.user,
  });

  res.status(200).json({
    status: "Success",
    newEnquiry,
    checkCity,
  });
});

// Get All Enquires All User can see all The enquires
exports.getAllEnquiry = catchAsync(async (req, res, next) => {
  const allEnquiry = await Enquiry.find().populate({
    path: "getEnquiy",
  });

  res.status(200).json({
    status: "Success",
    allEnquiry,
  });
});

// Respond On Enqurey By Other Users
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
  const enqueiryRequest = await SendEnquiry.find().populate({
    path: "user",
  });

  res.status(201).json({
    status: "Success",
    enqueiryRequest,
  });
});

// List of All Enquires Created By User
exports.ListOfCreatedEnquires = catchAsync(async (req, res, next) => {
  const CreatedEnquires = await Enquiry.find({ user: req.user._id });

  res.status(200).json({
    status: "Success",
    results: CreatedEnquires.length,
    CreatedEnquires,
  });
});
