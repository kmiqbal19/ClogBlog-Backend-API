const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "You must provide the username!"],
    },
    title: {
      type: String,
      required: [true, "You must provide post title!"],
    },
    description: {
      type: String,
      required: [true, "Description is required for the post!"],
    },
    photo: {
      type: String,
      required: false,
    },
    categories: {
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
