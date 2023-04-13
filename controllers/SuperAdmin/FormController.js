const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const Form = require("../../models/Forms/formFieldModel");

exports.CreateForm = catchAsync(async (req, res, next) => {
  const { formName, formFields } = req.body;
  const newForm = await Form.create({
    formName,
    formFields,
  });

  res.status(200).json({
    status: "Success",
    newForm,
  });
});

exports.getForm = catchAsync(async (req, res, next) => {
  const { formName } = req.query;
  const selectedForm = await Form.findOne({ formName });

  res.status(200).json({
    status: "Success",
    selectedForm,
  });
});
