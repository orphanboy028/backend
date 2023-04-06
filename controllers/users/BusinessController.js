const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const User = require("../../models/userModel");
const Business = require("../../models/BusinessModel");

exports.createBusiness = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user.isActive === false) {
    return next(
      new AppError(
        "you didn't verify your E-mail first verify your E-mail Address"
      )
    );
  }

  const { CompanyName, GstNumber, PanNumber, website } = req.body;
  const newBusiness = await Business.create({
    CompanyName,
    GstNumber,
    PanNumber,
    website,
    BusiessOwner: req.user._id,
  });

  // Find a user by ID and add the new business to their profile

  user.businessDetails = newBusiness._id;
  await user.save();

  res.status(200).json({
    status: "Success",
    newBusiness,
  });
});

exports.getUserBusinessDetails = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const details = await User.findById(_id);

  if (!details.businessDetails) {
    return next(
      new AppError(
        "you have didn't update business details first update business details"
      )
    );
  }

  res.status(200).json({
    status: "Success",
    details,
  });
});

// Update BUsiness Profile
exports.updateBusinessProfile = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  const business = await Business.findOneAndUpdate(
    { BusiessOwner: _id },
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    business,
  });
});
