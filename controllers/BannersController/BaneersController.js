const catchAsync = require("../../utils/catchAsync");
const path = require("path");
const AppError = require("../../utils/appError");
const sendEmail = require("../../utils/email");
const HomePageSliders = require("../../models/Banners/HomePageSliderModel");
const multer = require("multer");

const multerstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.resolve(
        `${__dirname}/../../../client/public/banners-images/HomePageSilder-banners`
      )
    );
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `Home-page-slider-banner-${req.user._id}-${Date.now()}.${ext}`);
  },
});

const upload = multer({
  storage: multerstorage,
  limits: { files: 3 },
});

exports.uploadHomePageSliderBanner = upload.array("Silderimages", 3);

exports.UploadHomePageSlider = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const photoNames = req.files.map((file) => file.filename); // get an array of all uploaded file names
  const { bannderDetails, clientName } = req.body;
  const images = photoNames.map((photoName) => ({
    url: photoName,
    altText: clientName,
  }));

  const sliderImage = await HomePageSliders.create({
    bannderDetails,
    clientName,
    Silderimages: images,
  });

  res.status(200).json({
    status: "Success",
    message: "Home Page Silder Banner is uploded",
    sliderImage,
  });
});

exports.getListHomeSliderBanner = catchAsync(async (req, res, next) => {
  const bannerLists = await HomePageSliders.find();

  res.status(200).json({
    status: "Success",
    message: "Get List of Banners",
    bannerLists,
  });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  const update = await HomePageSliders.findByIdAndUpdate(
    id,
    {
      status: "active",
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "Home Slider Activate",
    update,
  });
});

exports.InActivateStatus = catchAsync(async (req, res, next) => {
  const id = req.body.id;

  const update = await HomePageSliders.findByIdAndUpdate(
    id,
    {
      status: "inactive",
    },
    {
      new: true,
    }
  );

  res.status(200).json({
    status: "Success",
    message: "Home Slider Activate",
    update,
  });
});
