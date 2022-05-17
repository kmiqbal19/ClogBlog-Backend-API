const express = require("express");
const User = require("../model/userModel");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/signup").post(authController.signup);
module.exports = router;
