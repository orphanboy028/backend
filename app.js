const express = require("express");
const app = express();
const cors = require("cors");
const globalErrorHandler = require("./utils/errorController");
const authRoute = require("./routes/authRoute");

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

// global Error Control
app.use(globalErrorHandler);

module.exports = app;
