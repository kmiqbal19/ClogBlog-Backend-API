const User = require("../model/userModel");
const AppError = require("../util/appError");

const filteredObj = (obj, ...allowedItems) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedItems.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: "success",
      count: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.updateMe = async (req, res, next) => {
  try {
    // Create an error if there is password
    if (req.body.password || req.body.passwordCofirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword route",
          400
        )
      );
    }
    // Filtered out unwanted fields that are not allowed to be updated

    const filteredBody = filteredObj(req.body, "username", "email");
    // Update user document

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deactivateMe = async (req, res, next) => {
  try {
    // Find the user and turn the active property to false
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: "success",
      data: null,
      message: "Your account has been successfully deactivated!",
    });
  } catch (err) {
    next(err);
  }
};
