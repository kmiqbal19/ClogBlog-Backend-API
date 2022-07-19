const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A username must be provided!"],
    },
    fullname: {
      type: String,
      required: [true, "A full name must be provided!"],
    },
    email: {
      type: String,
      required: [true, "A email must be provided"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    password: {
      type: String,
      required: [true, "Please enter the password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm the correct password"],
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: "Passwords are not equal",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    photo: {
      type: String,
    },
    cloudinary_id: String,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);
// PRE SAVE MIDDLEWARE FROM MONGOOSE [Doesn't work on arrow functions, because the this. is undefined there]

// 1)
userSchema.pre("save", async function(next) {
  // Only run this func , if the password is actually modified
  if (!this.isModified("password")) return next();
  try {
    // ENCRYPT THE PASSWORD BEFORE SAVING
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  } catch (err) {
    next(err);
  }
  next();
});
// 2)
userSchema.pre(/^find/, function(next) {
  // 'this' points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Creating SCHEMA METHODS
// 1)
userSchema.methods.checkPassword = async function(givenPass, actualPass) {
  return await bcrypt.compare(givenPass, actualPass);
};
// 2)
userSchema.methods.isPasswordChanged = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimestamp > JWTTimestamp;
  }
  // False means password not changed
  return false;
};
// 3)
userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
