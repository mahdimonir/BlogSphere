import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const searchUsers = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    throw new NotFoundError("Search query is required");
  }

  const users = await User.find(
    {
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
      isSuspended: false,
      isVerified: true,
    },
    {
      _id: 1,
      userName: 1,
      email: 1,
      avatar: 1,
      role: 1, // Include role for UserCard badge
    }
  ).limit(5); // Limit to 5 results for performance

  if (!users || users.length === 0) {
    throw new NotFoundError("No users found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users found successfully"));
});

const searchPosts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    throw new NotFoundError("Search query is required");
  }

  const posts = await Post.aggregate([
    {
      $match: {
        isSuspended: false,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { "author.userName": { $regex: query, $options: "i" } },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        "author.userName": 1,
        "author.avatar": 1,
        catagory: 1,
      },
    },
    { $limit: 5 }, // Limit to 5 results for performance
  ]);

  if (!posts || posts.length === 0) {
    throw new NotFoundError("No posts found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts found successfully"));
});

export { searchPosts, searchUsers };
