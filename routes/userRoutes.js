const express = require("express");

const authController = require("../controller/authController");

const router = express.Router();
// SIGN UP
router.route("/signup").post(authController.signup);
// LOG IN
router.route("/login").post(authController.login);
module.exports = router;
