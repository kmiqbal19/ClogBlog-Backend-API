const express = require("express");
const postsController = require("../controller/postController");

const router = express.Router();

router.get("/", postsController.getPosts);
router.post("/", postsController.createPost);
router.put("/:id", postsController.updatePost);
router.delete("/:id", postsController.deletePost);

module.exports = router;
