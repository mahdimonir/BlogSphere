import mongoose from "mongoose";
import { Comment } from "../models/commentModel.js";
import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIf } from "../utils/throwIf.js";

// Utility function to toggle suspension
const toggleSuspension = async (Model, id, entityName, select = "") => {
  throwIf(!id, new ValidationError(`${entityName} ID is required`));
  throwIf(
    !mongoose.Types.ObjectId.isValid(id),
    new ValidationError(`Invalid ${entityName} ID: ${id}`)
  );

  const entity = await Model.findById(id).select(select);
  throwIf(!entity, new NotFoundError(`${entityName} not found`));

  entity.isSuspended = !entity.isSuspended;
  await entity.save();

  return {
    entity,
    message: `${entityName} ${
      entity.isSuspended ? "suspended" : "unsuspended"
    } successfully`,
  };
};

// Toggle user suspension - admin only
const toggleUserSuspension = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { entity, message } = await toggleSuspension(
    User,
    userId,
    "User",
    "-password"
  );

  return res.status(200).json(new ApiResponse(200, entity, message));
});

// Toggle post suspension - admin only
const togglePostSuspension = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { entity, message } = await toggleSuspension(Post, postId, "Post");

  return res.status(200).json(new ApiResponse(200, entity, message));
});

// Toggle comment suspension - admin only
const toggleCommentSuspension = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { entity, message } = await toggleSuspension(
    Comment,
    commentId,
    "Comment"
  );

  return res.status(200).json(new ApiResponse(200, entity, message));
});

// Get suspended users
const getSuspendedUsers = asyncHandler(async (req, res) => {
  const { query, page = 1, limit = 10 } = req.query;

  const matchStage = query
    ? {
        isSuspended: true,
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { userName: { $regex: query, $options: "i" } },
        ],
      }
    : { isSuspended: true };

  // Debug: Log all suspended users
  const suspendedUsers = await User.find({ isSuspended: true }).select(
    "userName isVerified"
  );

  // Count matching documents
  const matchCount = await User.countDocuments(matchStage);

  const aggregate = User.aggregate([
    { $match: matchStage },
    { $project: { password: 0 } }, // Equivalent to select("-password")
    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  let result;
  try {
    result = await User.aggregatePaginate(aggregate, options);
  } catch (error) {
    throw new Error("Failed to paginate suspended users");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalUsers: result.totalDocs,
      },
      "Suspended users fetched successfully"
    )
  );
});

// Get suspended posts
const getSuspendedPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const matchStage = search
    ? { title: { $regex: search, $options: "i" }, isSuspended: true }
    : { isSuspended: true };

  const aggregate = Post.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [
          { $project: { userName: 1, _id: 1 } }, // Include only userName and _id
        ],
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$post", "$$postId"] },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "author",
              pipeline: [
                { $project: { userName: 1, _id: 1 } }, // Include only userName and _id
              ],
            },
          },
          { $unwind: "$author" },
          {
            $lookup: {
              from: "likes",
              localField: "likes",
              foreignField: "_id",
              as: "likes",
            },
          },
          {
            $project: {
              content: 1,
              "author.userName": 1,
              "author._id": 1,
              createdAt: 1,
              parentComment: 1,
              isSuspended: 1,
              replies: 1,
              likeCount: { $size: "$likes" },
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "likes",
        foreignField: "_id",
        as: "likes",
      },
    },
    {
      $project: {
        title: 1,
        content: 1,
        image: 1,
        catagory: 1,
        tags: 1,
        status: 1,
        createdAt: 1,
        "author.userName": 1,
        "author._id": 1,
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        comments: 1,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const result = await Post.aggregatePaginate(aggregate, options);

  // Build comment tree for each post
  result.docs.forEach((post) => {
    const commentMap = {};
    const topLevelComments = [];

    post.comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id.toString()] = comment;
    });

    post.comments.forEach((comment) => {
      if (!comment.parentComment) {
        topLevelComments.push(comment);
      } else {
        const parentId = comment.parentComment.toString();
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(comment);
        } else {
          topLevelComments.push(comment);
        }
      }
    });

    post.comments = topLevelComments;
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        posts: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalPosts: result.totalDocs,
      },
      "Suspended posts retrieved successfully"
    )
  );
});

// Get suspended comments
const getSuspendedComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query } = req.query;

  const matchStage = query
    ? { content: { $regex: query, $options: "i" }, isSuspended: true }
    : { isSuspended: true };

  const aggregate = Comment.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
        pipeline: [
          { $project: { userName: 1, _id: 1 } }, // Include only userName and _id
        ],
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "likes",
        localField: "likes",
        foreignField: "_id",
        as: "likes",
      },
    },
    {
      $project: {
        content: 1,
        "author.userName": 1,
        "author._id": 1,
        createdAt: 1,
        post: 1,
        parentComment: 1,
        replies: 1,
        likeCount: { $size: "$likes" },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  let result;
  try {
    result = await Comment.aggregatePaginate(aggregate, options);
  } catch (error) {
    throw new Error("Failed to paginate suspended comments");
  }

  result.docs.forEach((comment) => {
    comment.replies = [];
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        comments: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
        totalComments: result.totalDocs,
      },
      "Suspended comments fetched successfully"
    )
  );
});

export {
  getSuspendedComments,
  getSuspendedPosts,
  getSuspendedUsers,
  toggleCommentSuspension,
  togglePostSuspension,
  toggleUserSuspension,
};
