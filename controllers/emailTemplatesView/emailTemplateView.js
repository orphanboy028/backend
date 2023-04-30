const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

exports.getOverview = catchAsync(async (req, res, next) => {
  console.log("render template");
  res.status(200).render("email/SingleProductEmail.ejs", {
    title: "Product Enquiries",
    msg: "user message",
  });
});
