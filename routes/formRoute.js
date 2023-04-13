const express = require("express");
const router = express.Router();
const FormController = require("../controllers/SuperAdmin/FormController");

router.post("/formdata", FormController.CreateForm);
router.get("/formdata", FormController.getForm);
module.exports = router;
