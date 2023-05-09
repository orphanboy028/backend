const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const User = require("../../models/userModel");
const Products = require("../../models/ProductsModel");
const Business = require("../../models/BusinessModel");
const multer = require("multer");
const ejs = require("ejs");
const { json } = require("express");
const qs = require("qs");
// const fs = require("fs");
// const base64Img = require("base64-img");

// const imgPath = path.join(__dirname, "../../public/img/logo.png");
// const base64Image = base64Img.base64Sync(imgPath);

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
  console.log(req.body);
  const { name, price, description, unit } = req.body;

  const photoname = req.file.filename;
  const priceNum = Number(price);
  // Limit the description content to 160 words
  const limitedDescription = description.substring(0, 160);
  const keywords = name
    .split(" ")
    .filter((word) => word.length >= 3)
    .join(", ");
  const newProduct = new Products({
    name,
    unit,
    price: priceNum,
    description,
    user: req.user._id,
    city: req.user.businessDetails.city,
    state: req.user.businessDetails.state,
    district: req.user.businessDetails.district,
    images: {
      url: photoname,
      altText: name,
    },
    productMetas: {
      MetaDescription: {
        content: limitedDescription,
      },
      Metakeywords: {
        content: keywords,
      },
    },
    ProductMetaog: {
      MetaOgTitle: {
        content: name,
      },
      MetaOgDescription: {
        content: limitedDescription,
      },
      MetaOgImage: {
        content: photoname,
      },
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
  const allProducts = await Products.find({ status: "active" });
  res.status(200).json({
    status: "Success",
    results: allProducts.length,
    allProducts,
  });
});

exports.getUserProducts = catchAsync(async (req, res, next) => {
  console.log(req.user._id);
  const { id } = req.user._id;
  console.log(id);
  const Userproduct = await Products.find({ user: req.user._id });
  res.status(200).json({
    status: "Success",
    results: Userproduct.length,
    Userproduct,
  });
});

// update product  spacification
exports.updateProductSpacfification = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  console.log(slug);
  console.log(req.body);
  const product = await Products.findOneAndUpdate(
    { slug: slug },
    {
      properties: req.body.properties,
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

exports.updateBiasieDetails = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { name, price, description, unit } = req.body;
  const priceNum = Number(price);
  const product = await Products.findOneAndUpdate(
    { slug: slug },
    {
      name,
      price: priceNum,
      unit,
      description,
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "Product Details updated",
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
  const Product = await Products.findOne({ slug });

  res.status(200).json({
    status: "Success",
    Product,
  });
});

// Update only Product Image
exports.updateOnlyProductImage = catchAsync(async (req, res, next) => {
  const photoname = req.file.filename;
  const { slug } = req.params;
  console.log("updateOnlyProductImage");
  console.log(slug);

  const imageUpdate = await Products.findOneAndUpdate(
    { slug: slug },
    {
      images: {
        url: photoname,
      },
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "Product Image Updated Sucessfully",
    slug,
    imageUpdate,
  });
});

exports.deActivateProduct = catchAsync(async (req, res, next) => {
  const product = await Products.findByIdAndUpdate(
    req.body.id,
    {
      status: "inactive",
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "Product Deactivate succesfully",
    product,
  });
});

exports.ActivateProduct = catchAsync(async (req, res, next) => {
  console.log(req.body.id);

  const product = await Products.findByIdAndUpdate(
    req.body.id,

    {
      status: "active",
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "Product activate succesfully",
    product,
  });
});

exports.DeleteProduct = catchAsync(async (req, res, next) => {
  console.log("run");
  console.log(req.body.id);

  const product = await Products.findByIdAndDelete(req.body.id);

  res.status(200).json({
    status: "Success",
    message: "Product Delete succesfully",
    product,
  });
});

// enquires for single product
exports.SendSingleproductEnqiires = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const { message } = req.body;
  console.log("slug", message);
  const ProductEnquirie = await Products.findOneAndUpdate(
    { slug: slug },
    {
      $addToSet: { productEnquiries: req.user._id },
    },
    {
      new: true,
    }
  );

  // const templateData = { msg: message, image: base64Image };
  const templateData = {
    msg: message,
  };

  const template = "SingleProductEmail";
  const html = await ejs.renderFile(
    `views/email/${template}.ejs`,
    templateData
  );
  // Send Email To User for Product Enquiries
  await sendEmail({
    email: req.user.email,
    subject: "Product Enquire",
    message: html,
  });

  res.status(201).json({
    status: "Success",
    ProductEnquirie,
  });
});

// Product Enquires
exports.productEnquires = catchAsync(async (req, res, next) => {
  const product = await Products.find({
    user: req.user._id,
    productEnquiries: { $exists: true, $not: { $size: 0 } },
  });

  res.status(200).json({
    status: "Success",
    results: product.length,
    product,
  });
});

// single Product Enquires
exports.SingleproductEnquires = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  console.log(slug);
  const product = await Products.findOne({ slug: slug }).populate({
    path: "productEnquiries",
  });

  res.status(200).json({
    status: "Success",
    // results: product.length,
    product,
  });
});

// Product Enquires super Admin
exports.SuperAdminproductEnquires = catchAsync(async (req, res, next) => {
  const product = await Products.find({
    productEnquiries: { $exists: true, $not: { $size: 0 } },
  });

  res.status(200).json({
    status: "Success",
    results: product.length,
    product,
  });
});

//Super Admim single Product Enquires
exports.SuperAdminSingleproductEnquires = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  console.log(slug);
  const product = await Products.findOne({ slug: slug }).populate({
    path: "productEnquiries",
  });

  res.status(200).json({
    status: "Success",
    // results: product.length,
    product,
  });
});

// Fillter product api
exports.getSearchProduct = catchAsync(async (req, res, next) => {
  // Get the search query from the request
  const queryObj = qs.parse(req.query); // parse the query string into an object

  console.log(queryObj);

  if (queryObj.name) {
    queryObj.name = { $regex: queryObj.name, $options: "i" };
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  // Convert price strings to numbers
  const query = JSON.parse(queryStr);
  if (query.price) {
    const minPrice = parseInt(query.price.$gte);
    const maxPrice = parseInt(query.price.$lte);
    query.price = { $gte: minPrice, $lte: maxPrice };
  }

  // Perform a partial text search on product name

  console.log(query);

  const Searchproducts = await Products.find(query);

  res.status(200).json({
    status: "Success",
    results: Searchproducts.length,
    queryObj,
    query,
    Searchproducts,
  });
});

// exports.getSearchProduct = catchAsync(async (req, res, next) => {
//   let queryObj;

//   // Check if the request is from a browser or Postman
//   if (req.headers["user-agent"].includes("Mozilla")) {
//     // Request is from a browser
//     queryObj = {
//       city: req.query.city,
//       district: req.query.district,
//       state: req.query.state,
//       price: {
//         $gte: req.query.price.gte,
//         $lte: req.query.price.lte,
//       },
//       name: { $regex: req.query.name, $options: "i" },
//     };
//     console.log("from Browser");
//     console.log(queryObj);
//   } else {
//     // Request is from Postman
//     queryObj = { ...req.query };
//     queryObj.price = {
//       $gte: parseInt(queryObj.price.gte),
//       $lte: parseInt(queryObj.price.lte),
//     };
//     queryObj.name = { $regex: queryObj.name, $options: "i" };
//     console.log("from Browser");
//     console.log(queryObj);
//   }

//   const searchProducts = await Products.find(queryObj);

//   res.status(200).json({
//     status: "Success",
//     results: Searchproducts.length,
//     searchProducts,
//   });
// });
