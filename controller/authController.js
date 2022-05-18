const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../model/userModel");
const AppError = require("../util/appError");

const createJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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
