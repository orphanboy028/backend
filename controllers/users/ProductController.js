const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const User = require("../../models/userModel");
const Products = require("../../models/ProductsModel");
const Business = require("../../models/BusinessModel");
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
  const newProduct = new Products({
    name,
    price,
    description,
    user: req.user._id,
    images: {
      url: photoname,
      altText: name,
    },
  });

  const saveProduct = await newProduct.save(); // use await to save the product
  console.log(req.user._id);
  const business = await Business.findOne({ BusiessOwner: req.user._id });

  if (business.products && business.products.length > 0) {
    business.products.push(saveProduct._id); // push product ID into products array
  } else {
    business.products = [saveProduct._id]; // create a new products array with the new product ID
  }

  await business.save();

  res.status(200).json({
    status: "Success",
    message: "Product sucessfully added",
    saveProduct,
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

// GET SINGLE PRODUCT
exports.getSingleProduct = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  console.log(slug);
  const singleProduct = await Products.findOne({ slug });

  res.status(200).json({
    status: "Success",
    // results: singleProduct.length,
    singleProduct,
  });
});
