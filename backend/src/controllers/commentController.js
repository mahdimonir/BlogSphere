const Comment = require("../models/Comment");

exports.createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const comment = new Comment({ content, post: postId, author: req.user.id });
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId, isSuspended: false })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment || comment.isSuspended)
      return res.status(404).json({ message: "Comment not found" });
    if (
      comment.author.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await comment.remove();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.suspendComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    comment.isSuspended = true;
    await comment.save();
    res.json({ message: "Comment suspended" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
