import { Comment } from "../models/commentModel.js";
import { Like } from "../models/likeModel.js";
import { Post } from "../models/postModel.js";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIf } from "../utils/throwIf.js";

// Create a top-level comment
const createComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.userId;

  // Validate input
  throwIf(!postId, new ValidationError("Post ID is required"));
  throwIf(
    !content || content.trim() === "",
    new ValidationError("Content is required")
  );

  // Validate post existence
  const post = await Post.findById(postId);
  throwIf(!post || post.isSuspended, new NotFoundError("Post not found"));

  // Create the comment
  const comment = new Comment({
    content: content.trim(),
    post: postId,
    author: userId,
    parentComment: null,
  });
  await comment.save();

  // Add to post's comments array
  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
  });

  // Populate author
  await comment.populate({ path: "author", select: "userName" });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// Create a nested comment (reply)
const createNestedComment = asyncHandler(async (req, res) => {
  const { parentCommentId, content } = req.body;
  const userId = req.userId;

  // Validate input
  throwIf(
    !parentCommentId,
    new ValidationError("Parent comment ID is required")
  );
  throwIf(
    !content || content.trim() === "",
    new ValidationError("Content is required")
  );

  // Validate parent comment existence
  const parentComment = await Comment.findById(parentCommentId);
  throwIf(
    !parentComment || parentComment.isSuspended,
    new NotFoundError("Parent comment not found")
  );

  // Validate post existence
  const postId = parentComment.post;
  const post = await Post.findById(postId);
  throwIf(!post || post.isSuspended, new NotFoundError("Post not found"));

  // Optional: Limit nesting depth (e.g., max 5 levels)
  let depth = 0;
  let current = parentComment;
  while (current && current.parentComment) {
    depth++;
    if (depth > 5) {
      throw new ValidationError("Maximum reply depth exceeded");
    }
    current = await Comment.findById(current.parentComment);
  }

  // Create the reply
  const comment = new Comment({
    content: content.trim(),
    post: postId,
    author: userId,
    parentComment: parentCommentId,
  });
  await comment.save();

  // Add to parent's replies array
  await Comment.findByIdAndUpdate(parentCommentId, {
    $push: { replies: comment._id },
  });

  // Populate author
  await comment.populate({ path: "author", select: "userName" });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Reply added successfully"));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId, content } = req.body;
  const userId = req.userId;

  // Validate input
  throwIf(!commentId, new ValidationError("Comment ID is required"));
  throwIf(
    !content || content.trim() === "",
    new ValidationError("Content is required")
  );

  // Validate comment existence
  const comment = await Comment.findById(commentId);
  throwIf(
    !comment || comment.isSuspended,
    new NotFoundError("Comment not found")
  );

  // Check authorization
  throwIf(
    comment.author._id.toString() !==
      (req.userId.toString ? req.userId.toString() : req.userId),
    new ForbiddenError("You are not authorized to update this comment")
  );

  // Update the comment
  comment.content = content.trim();
  await comment.save();

  // Populate author
  await comment.populate({ path: "author", select: "userName" });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// Delete a comment (and its replies recursively)
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  // Validate input
  throwIf(!commentId, new ValidationError("Comment ID is required"));

  // Validate comment existence
  const comment = await Comment.findById(commentId);
  throwIf(
    !comment || comment.isSuspended,
    new NotFoundError("Comment not found")
  );

  // Check authorization
  throwIf(
    comment.author._id.toString() !==
      (req.userId.toString ? req.userId.toString() : req.userId),
    new ForbiddenError("You are not authorized to delete this comment")
  );

  // Recursively delete replies
  const deleteReplies = async (commentId) => {
    try {
      const comment = await Comment.findById(commentId).select("replies");
      if (!comment || !comment.replies.length) return;

      await Promise.all(
        comment.replies.map(async (replyId) => {
          await deleteReplies(replyId);
          await Comment.findByIdAndDelete(replyId);
          await Like.deleteMany({ comment: replyId });
        })
      );
    } catch (error) {
      throw new Error(
        `Failed to delete replies for comment ${commentId}: ${error.message}`
      );
    }
  };

  // Delete replies
  await deleteReplies(commentId);

  // Delete associated likes
  await Like.deleteMany({ comment: commentId });

  // Remove from post's comments array (if top-level)
  if (!comment.parentComment) {
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
    });
  }

  // Remove from parent's replies array (if a reply)
  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: commentId },
    });
  }

  // Delete the comment itself
  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully!"));
});

// Get comments for a post with multi-level nested replies
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  // Validate post existence
  const post = await Post.findById(postId);
  throwIf(!post || post.isSuspended, new NotFoundError("Post not found"));

  // Fetch all comments for the post
  const comments = await Comment.find({ post: postId, isSuspended: false })
    .populate("author", "userName")
    .populate("likes")
    .sort({ createdAt: -1 }) // Sort by creation date (newest first)
    .lean();

  // Build comment tree
  const commentMap = {};
  const topLevelComments = [];

  // Initialize comments with empty replies array
  comments.forEach((comment) => {
    comment.replies = []; // Initialize replies
    comment.likeCount = comment.likes.length; // Calculate likeCount
    delete comment.likes; // Remove likes array
    commentMap[comment._id.toString()] = comment;
  });

  // Assign replies to their parents
  comments.forEach((comment) => {
    if (!comment.parentComment) {
      topLevelComments.push(comment);
    } else {
      const parentId = comment.parentComment.toString();
      if (commentMap[parentId]) {
        commentMap[parentId].replies.push(comment);
      }
    }
  });

  return res.json(
    new ApiResponse(200, topLevelComments, "Comments fetched successfully")
  );
});

export {
  createComment,
  createNestedComment,
  deleteComment,
  getComments,
  updateComment,
};
