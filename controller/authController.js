const User = require("../model/userModel");
const AppError = require("../util/appError");
const jwt = require("jsonwebtoken");
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if the email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // Check if the user exist and password matches
    const user = await User.findOne({ email });
    const check = user && (await user.checkPassword(password, user.password));

    if (!user || check === false) {
      return next(new AppError("Incorrect email or Password", 401));
    }
    res.status(200).json({
      status: "success",
      message: "You are successfully logged in to your account.",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
