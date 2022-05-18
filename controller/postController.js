const Post = require("../model/postModel");
const AppError = require("../util/appError");

// GET ALL POSTS
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      status: "success",
      data: {
        posts,
      },
    });
  } catch (err) {
    next(err);
  }
};
// CREATE NEW POST
exports.createPost = async (req, res, next) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json({
      status: "success",
      data: {
        post: savedPost,
      },
    });
  } catch (err) {
    next(err);
  }
};
// UPDATE EXISTING POST
exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return next(new AppError("No post found!", 404));
    if (post.username === req.body.username) {
      try {
        const newPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true,
        });
        res.status(200).json({
          status: "success",
          data: {
            post: newPost,
          },
        });
      } catch (err) {
        next(err);
      }
    } else {
      res.status(401).json({
        status: "unauthorized",
        message: "You can only update your post!",
      });
    }
  } catch (err) {
    next(err);
  }
};
// DELETE POST
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (req.body.username === post.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
          status: "success",
          message: "Your post has been deleted successfully!",
        });
      } catch (err) {
        next(err);
      }
    } else {
      res.status(401).json({
        status: "unauthorized",
        message: "You can only delete your own post!",
      });
    }
  } catch (err) {
    next(err);
  }
};
