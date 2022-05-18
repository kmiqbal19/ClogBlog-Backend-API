const express = require("express");
const postsController = require("../controller/postController");
const authController = require("../controller/authController");

const router = express.Router();

router.get("/", authController.protect, postsController.getPosts);
router.post("/", postsController.createPost);
router.put("/:id", postsController.updatePost);
router.delete("/:id", postsController.deletePost);

module.exports = router;
