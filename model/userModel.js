const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name must be provided!"],
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
    // select: false
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
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
});
// Using pre save middleware provided from mongoose [Doesn't work on arrow functions, because the this. is undefined there]
userSchema.pre("save", async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
  } catch (err) {
    next(err);
  }
  next();
});
// Creating SCHEMA METHODS
userSchema.methods.checkPassword = async function(givenPass, actualPass) {
  return await bcrypt.compare(givenPass, actualPass);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
