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

// BODY PARSER READING data FROM into req.body
app.use(cors({ origin: `${process.env.CLINENT_URL}` }));
app.use(express.json());

// Routes
app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "Success",
  });
});

app.use("/api/V1/industry/auth", authRoute);
app.use("/api/V1/industy/super-admin", superAdminAuthRoute);
app.use("/api/V1/industy/business", BusinessRoute);
app.use("/api/V1/industy/categories", categoriesRoute);
app.use("/api/V1/industy/product", productRoute);
app.use("/api/V1/industy/form", formRoute);

// global Error Control
app.use(globalErrorHandler);

module.exports = app;
