const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const SuperAdmin = require("../models/SuperAdminModel");
const sendEmail = require("./../utils/email");
const User = require("../models/userModel");
const Products = require("../models/ProductsModel");

exports.UpdateProductMetaDescreption = catchAsync(async (req, res, next) => {
  // Find Product by slug
  const { content } = req.body;
  const { slug } = req.params;
  const product = await Products.findOneAndUpdate(
    { slug: slug },
    {
      productMetas: {
        MetaDescription: {
          content,
        },
      },
    }
  );

  res.status(200).json({
    status: "Success",
    message: "your product meta Descreption updated succesfully",
    slug,
    product,
  });
});

exports.UpdateProductKeywords = catchAsync(async (req, res, next) => {
  // Find Product by slug
  const { content } = req.body;
  const { slug } = req.params;
  const product = await Products.findOneAndUpdate(
    { slug: slug },
    {
      productMetas: {
        Metakeywords: {
          content,
        },
      },
    }
  );

  res.status(200).json({
    status: "Success",
    message: "your product meta Keywords updated succesfully",
    slug,
    product,
  });
});

exports.UpdateMetaOgTitle = catchAsync(async (req, res, next) => {
  // Find Product by slug
  const { ogTitle } = req.body;
  console.log(ogTitle);
  const { slug } = req.params;
  const product = await Products.findOneAndUpdate(
    { slug: slug },
    {
      $set: {
        "ProductMetaog.MetaOgTitle.content": ogTitle,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "your product Social Media OG Title  updated succesfully",
    product,
  });
});

exports.UpdateMetaOgDescription = catchAsync(async (req, res, next) => {
  // Find Product by slug
  const { ogdescription } = req.body;
  const { slug } = req.params;
  const product = await Products.findOneAndUpdate(
    { slug: slug },
    {
      $set: {
        "ProductMetaog.MetaOgDescription.content": ogdescription,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "your product Social Media Descreption  updated succesfully",
    product,
  });
});
