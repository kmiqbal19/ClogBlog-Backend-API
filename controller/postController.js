const Post = require("../model/postModel");
const AppError = require("../util/appError");

// GET ALL POSTS
exports.getPosts = async (req, res, next) => {
  const ITEMS_PER_PAGE = 3;
  const page = req.query.page || 1;
  const skip = (page - 1) * ITEMS_PER_PAGE;
  try {
    const queryObj = { ...req.query };
    // const excludedFields = ["page", "sort", "limit", "fields"];
    // excludedFields.forEach((el) => delete queryObj[el]);

    let posts;
    let count = 0;
    const category = queryObj.cat;
    const { search } = queryObj;

    if (category) {
      count = await (await Post.find({ categories: { $in: category } })).length;
      posts = await Post.find({ categories: { $in: category } })
        .limit(ITEMS_PER_PAGE)
        .skip(skip);
    } else if (search) {
      const promise = Post.find({ title: { $regex: search, $options: "i" } });
      count = (await promise).length;
      posts = await Post.find({
        title: { $regex: search, $options: "i" },
      })
        .limit(ITEMS_PER_PAGE)
        .skip(skip);
      // count = await Post.find({
      //   title: { $regex: search, $options: "i" },
      // }).length;
      // console.log(count);
    } else {
      count = await (await Post.find({ queryObj })).length;
      posts = await Post.find(queryObj)
        .limit(ITEMS_PER_PAGE)
        .skip(skip);
    }
    const pageCount =
      count % ITEMS_PER_PAGE > 0
        ? Math.trunc(count / ITEMS_PER_PAGE) + 1
        : count / ITEMS_PER_PAGE;

    res.status(200).json({
      status: "success",
      documents: posts.length,
      pagination: {
        count,
        pageCount,
      },
      data: {
        posts,
      },
    });
  } catch (err) {
    next(err);
  }
};
// GET SINGLE POST
exports.getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new AppError("There is no post with this ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        post,
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
