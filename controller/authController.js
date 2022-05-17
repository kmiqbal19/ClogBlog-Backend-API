const User = require("../model/userModel");
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json(err.stack);
  }
};
