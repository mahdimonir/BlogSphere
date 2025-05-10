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

// Utility function for shared comment creation logic
const createCommentDocument = async ({
  content,
  postId,
  authorId,
  parentCommentId,
}) => {
  throwIf(
    !content || content.trim() === "",
    new ValidationError("Content is required")
  );

  const comment = new Comment({
    content: content.trim(),
    post: postId,
    author: authorId,
    parentComment: parentCommentId || null,
  });
  await comment.save();

  await comment.populate({ path: "author", select: "userName avatar" });

  return comment;
};

// Create a top-level comment
const createComment = asyncHandler(async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.userId;

  throwIf(!postId, new ValidationError("Post ID is required"));

  const post = await Post.findById(postId);
  throwIf(!post || post.isSuspended, new NotFoundError("Post not found"));

  const comment = await createCommentDocument({
    content,
    postId,
    authorId: userId,
  });

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: comment._id },
    $inc: { commentCount: 1 },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

// Create a nested comment (reply)
const createNestedComment = asyncHandler(async (req, res) => {
  const { parentCommentId, content } = req.body;
  const userId = req.userId;

  throwIf(
    !parentCommentId,
    new ValidationError("Parent comment ID is required")
  );

  const parentComment = await Comment.findById(parentCommentId);
  throwIf(
    !parentComment || parentComment.isSuspended,
    new NotFoundError("Parent comment not found")
  );

  const postId = parentComment.post;
  const post = await Post.findById(postId);
  throwIf(!post || post.isSuspended, new NotFoundError("Post not found"));

  let depth = 0;
  let current = parentComment;
  while (current && current.parentComment) {
    depth++;
    if (depth > 5) {
      throw new ValidationError("Maximum reply depth exceeded");
    }
    current = await Comment.findById(current.parentComment);
  }

  const comment = await createCommentDocument({
    content,
    postId,
    authorId: userId,
    parentCommentId,
  });

  await Comment.findByIdAndUpdate(parentCommentId, {
    $push: { replies: comment._id },
  });

  await Post.findByIdAndUpdate(postId, {
    $inc: { commentCount: 1 },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Reply added successfully"));
});

// Update a comment
const updateComment = asyncHandler(async (req, res) => {
  const { commentId, content } = req.body;
  const userId = req.userId;

  throwIf(!commentId, new ValidationError("Comment ID is required"));
  throwIf(
    !content || content.trim() === "",
    new ValidationError("Content is required")
  );

  const comment = await Comment.findById(commentId);
  throwIf(
    !comment || comment.isSuspended,
    new NotFoundError("Comment not found")
  );

  throwIf(
    comment.author._id.toString() !==
      (req.userId.toString ? req.userId.toString() : req.userId),
    new ForbiddenError("You are not authorized to update this comment")
  );

  comment.content = content.trim();
  await comment.save();

  await comment.populate({ path: "author", select: "userName avatar" });

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

// Delete a comment (and its replies recursively)
const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;

  throwIf(!commentId, new ValidationError("Comment ID is required"));

  const comment = await Comment.findById(commentId);
  throwIf(
    !comment || comment.isSuspended,
    new NotFoundError("Comment not found")
  );

  throwIf(
    comment.author._id.toString() !==
      (req.userId.toString ? req.userId.toString() : req.userId),
    new ForbiddenError("You are not authorized to delete this comment")
  );

  const deleteReplies = async (commentId) => {
    try {
      const comment = await Comment.findById(commentId).select("replies");
      if (!comment || !comment.replies.length) return;

      await Promise.all(
        comment.replies.map(async (replyId) => {
          await deleteReplies(replyId);
          await Comment.findByIdAndDelete(replyId);
          await Like.deleteMany({ comment: replyId });
          await Post.findByIdAndUpdate(comment.post, {
            $inc: { commentCount: -1 },
          });
        })
      );
    } catch (error) {
      throw new Error(
        `Failed to delete replies for comment ${commentId}: ${error.message}`
      );
    }
  };

  await deleteReplies(commentId);

  await Like.deleteMany({ comment: commentId });

  if (!comment.parentComment) {
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: commentId },
      $inc: { commentCount: -1 },
    });
  }

  if (comment.parentComment) {
    await Comment.findByIdAndUpdate(comment.parentComment, {
      $pull: { replies: commentId },
    });
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Comment deleted successfully!"));
});

// Get comments for a post with multi-level nested replies
const getComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  throwIf(!post || post.isSuspended, new NotFoundError("Post not found"));

  const comments = await Comment.find({ post: postId, isSuspended: false })
    .populate("author", "userName avatar")
    .populate("likes")
    .sort({ createdAt: -1 })
    .lean();

  const commentMap = {};
  const topLevelComments = [];

  comments.forEach((comment) => {
    comment.replies = [];
    comment.likeCount = comment.likes.length;
    delete comment.likes;
    commentMap[comment._id.toString()] = comment;
  });

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
