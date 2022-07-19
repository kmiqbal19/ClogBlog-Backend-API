const express = require("express");
const postsController = require("../controller/postController");
// const authController = require("../controller/authController");

const router = express.Router();
router.get("/", postsController.getPosts);
router.get("/:id", postsController.getSinglePost);
// Protect Every Routes after this middleware
// router.use(authController.protect);
router.post("/", postsController.uploadPostImage, postsController.createPost);
router.put("/:id", postsController.uploadPostImage, postsController.updatePost);
router.delete(
  "/:id",
  postsController.uploadPostImage,
  postsController.deletePost
);

module.exports = router;
