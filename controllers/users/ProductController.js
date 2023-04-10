const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const User = require("../../models/userModel");
const Products = require("../../models/ProductsModel");
const multer = require("multer");

const multerstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.resolve(`${__dirname}/../../../client/public/product-feature-imges`)
    );
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerstorage,
});

exports.productFeatureImage = upload.single("images");

// Create Product
exports.createProduct = catchAsync(async (req, res, next) => {
  const { name, price, description } = req.body;
  const photoname = req.file.filename;
  const createProduct = await Products.create({
    name,
    price,
    description,
    user: req.user._id,
    images: {
      url: photoname,
      altText: name,
    },
  });

  res.status(200).json({
    status: "Success",
    createProduct,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const allProducts = await Products.find();
  res.status(200).json({
    status: "Success",
    results: allProducts.length,
    allProducts,
  });
});

exports.getUserProducts = catchAsync(async (req, res, next) => {
  const { userId } = req.query;
  const Userproduct = await Products.find({ user: userId });
  res.status(200).json({
    status: "Success",
    results: Userproduct.length,
    Userproduct,
  });
});

// update product  spacification
exports.updateProductSpacfification = catchAsync(async (req, res, next) => {
  const { slug } = req.query;
  console.log(slug);
  console.log(req.body);
  const product = await Products.findOneAndUpdate(
    slug,
    {
      properties: req.body,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    results: product.length,
    product,
  });
});

// get user Single Product
exports.getUserSingleProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.query;
  console.log(slug);
  const singleProduct = await Products.findOne({ slug });

  res.status(200).json({
    status: "Success",
    // results: singleProduct.length,
    singleProduct,
  });
});
