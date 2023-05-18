const express = require("express");
const app = express();
const cors = require("cors");
const globalErrorHandler = require("./utils/errorController");
const authRoute = require("./routes/authRoute");
const superAdminAuthRoute = require("./routes/SuperAdminAuth");
const BusinessRoute = require("./routes/BusinessRoute");
const categoriesRoute = require("./routes/CategoriesRoutes");
const productRoute = require("./routes/ProductRoute");
const formRoute = require("./routes/formRoute");
const EnquiryRouter = require("./routes/EnquiryRouter");
const UserRouter = require("./routes/UserRoutes");
const SendEnquiryRoute = require("./routes/SendEnquiryRoute");
const SuperAdminProductSEORoute = require("./routes/Super-admin/SuperAdminProductSEORoute");
const BannerRoute = require("./routes/Super-admin/Banners/BannersRoute");
const UsertrackUserActivity = require("./utils/TrackingMidelwear");
const viewRoutes = require("./routes/viewRoutes");
const path = require("path");
const ejs = require("ejs");

// BODY PARSER READING data FROM into req.body
// app.use(cors({ origin: `${process.env.CLINENT_URL}` }));

// app.use(cors({ origin: `${process.env.CLINENT_URL}` }));

// app.options("*", cors());

// Enable CORS

app.use(
  cors({
    origin: "http://192.168.42.212:3000", // Replace with your domain
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.set("view engine", ejs);
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

// Routes
// app.get("/", (req, res, next) => {
//   req.session.test = "testsession";
//   res.status(200).json({
//     status: "Success",
//     sessionvalue: req.session.test,
//   });
// });

app.use((req, res, next) => {
  console.log("Request URL:", req.url);

  next();
});

app.use("/overview", viewRoutes);
app.use("/api/V1/industry/auth", authRoute);
app.use("/api/V1/industy/super-admin", superAdminAuthRoute);
app.use("/api/V1/industy/business", BusinessRoute);
app.use("/api/V1/industy/categories", categoriesRoute);
app.use("/api/V1/industy/product", productRoute);
app.use("/api/V1/industy/form", formRoute);
app.use("/api/V1/industy/enquiry", EnquiryRouter);
app.use("/api/V1/industy/users", UserRouter);
app.use("/api/V1/industy/sendenquiry", SendEnquiryRoute);
app.use("/api/V1/industy/super-seo", SuperAdminProductSEORoute);
app.use("/api/V1/industy/super-admin/banners", BannerRoute);

// global Error Control
app.use(globalErrorHandler);

module.exports = app;
