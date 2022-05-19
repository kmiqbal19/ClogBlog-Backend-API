const express = require("express");

const authController = require("../controller/authController");
const usersController = require("../controller/usersController");

const router = express.Router();
// SIGN UP
router.route("/signup").post(authController.signup);
// LOG IN
router.route("/login").post(authController.login);
// FORGOT PASSWORD
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:resetToken").patch(authController.resetPassword);
// GET USERS
router.route("/").get(usersController.getUsers);
router.route("/:id").get(usersController.getUser);
module.exports = router;
