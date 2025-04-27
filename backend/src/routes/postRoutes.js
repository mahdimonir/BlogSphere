const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  getMyPosts,
  suspendPost,
  unsuspendPost,
} = require("../controllers/postController");
const { auth, admin } = require("../middleware/auth");

router.get("/", getPosts);
// router.get('/my', auth, getMyPosts);
// router.get('/:id', getPost);
router.post("/", auth, createPost);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.put("/suspend/:id", auth, admin, suspendPost);
router.put("/unsuspend/:id", auth, admin, unsuspendPost);

module.exports = router;
