const express = require("express");
const router = express.Router();
const {
  createComment,
  getComments,
  deleteComment,
  getAllComments,
} = require("../controllers/commentController");
const { auth, admin } = require("../middleware/auth");

router.get("/:postId", getComments);
router.post("/:postId", auth, createComment);
router.delete("/:id", auth, admin, deleteComment);
router.get("/all", auth, admin, getAllComments);

module.exports = router;
