const multer = require("multer");
const User = require("../model/userModel");
const AppError = require("../util/appError");
const cloudinary = require("../util/cloudinary");

const filteredObj = (obj, ...allowedItems) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedItems.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// GET USERS
exports.getUsers = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const users = await User.find(queryObj);
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
// UPDATE USER DATA
// Create multer for user image
const multerStorage = multer.diskStorage({});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only images can be uploaded", 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
exports.updateUserImage = upload.single("photo");
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

    const filteredData = filteredObj(
      req.body,
      "username",
      "id",
      "email",
      "fullname",
      "photo",
      "cloudinary_id"
    );
    // Update user document
    if (req.file) {
      if (filteredData.cloudinary_id) {
        await cloudinary.uploader.destroy(filteredData.cloudinary_id);
      }
      const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "clogblog_users",
        eager: [
          {
            width: 500,
            height: 500,
            crop: "fill",
            gravity: "auto",
          },
        ],
      });
      filteredData.photo = uploadedImg.eager[0].secure_url;
      filteredData.cloudinary_id = uploadedImg.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(
      // req.user.id will be used when protect will be used
      // req.user.id,
      req.body.id,
      filteredData,
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
// DELETE USER
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
