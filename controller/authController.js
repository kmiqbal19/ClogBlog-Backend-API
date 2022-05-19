const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");
const User = require("../model/userModel");
const AppError = require("../util/appError");

// JSON WEB TOKEN CREATION
const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
// PROTECT MIDDLEWARE FOR ROUTES
exports.protect = async (req, res, next) => {
  try {
    // GET Token and CHECK if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
      return next(
        new AppError("You are not logged in. Please login to get access.", 401)
      );
    // VERIFY Token

    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET_KEY
    );

    // CHECK if USER still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token does not exists! ", 401)
      );
    }
    // CHECK if USER CHANGED PASSWORD after the token was issued
    if (currentUser.isPasswordChanged(decoded.iat)) {
      return next(
        new AppError(
          "User Recently changed the password! Please log in again!",
          401
        )
      );
    }
    // GRANT ACCESS to protected routes
    req.user = currentUser;

    next();
  } catch (err) {
    next(err);
  }
};
// SIGN UP
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const token = createJWT(newUser._id);

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
// LOG IN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if the email and password exists
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }
    // Check if the user exist and password matches
    const user = await User.findOne({ email }).select("+password");
    const check = user && (await user.checkPassword(password, user.password));

    if (!user || check === false) {
      return next(new AppError("Incorrect email or Password", 401));
    }
    // If everything is Successful we send a new jwt token for this user
    const token = createJWT(user._id);
    res.status(200).json({
      status: "success",
      message: "You are successfully logged in to your account.",
      token,
    });
  } catch (err) {
    next(err);
  }
};
// FORGOT PASSWORD
exports.forgotPassword = async (req, res, next) => {
  try {
    // Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("There is no user with this email.", 401));
    }
    // Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    // Send this token to user's EMAIL
    res.status(200).json({
      status: "success",
      resetToken,
      message: "Token sent to your email",
    });
  } catch (err) {
    next(err);
  }
};

// RESET PASSWORD

exports.resetPassword = async (req, res, next) => {
  try {
    // Get user based on the reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return new AppError("Token is invalid or has expired!", 400);
    }

    // If token has not expired, and there is user,set the NEW PASSWORD
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    // Update changedPasswordAt property for the user
    user.passwordChangedAt = Date.now();
    // SAVE the user
    await user.save();
    // Log the user in, send JWT
    const token = createJWT(user._id);
    // Remove the password from the output
    user.password = undefined;
    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
