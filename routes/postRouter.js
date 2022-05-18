const postsController = require("../controller/postController");
const express = require("express");

const router = express.Router();

router.get("/", postsController.getPosts);
router.post("/", postsController.createPost);

module.exports = router;
