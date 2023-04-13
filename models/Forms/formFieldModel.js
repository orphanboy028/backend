const mongoose = require("mongoose");

const formFieldSchema = new mongoose.Schema({
  label: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  options: { type: [String], required: false },
});

const formDataSchema = new mongoose.Schema({
  formName: { type: String, required: true },
  formFields: { type: [formFieldSchema], required: true },
});

const FormData = mongoose.model("FormData", formDataSchema);

module.exports = FormData;
