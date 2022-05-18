const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A username must be provided!"],
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
          console.log(el);
          return el === this.password;
        },
        message: "Passwords are not equal",
      },
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
  },
  { timestamps: true }
);
// PRE SAVE MIDDLEWARE FROM MONGOOSE [Doesn't work on arrow functions, because the this. is undefined there]
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
  return false;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
