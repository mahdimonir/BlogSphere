import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { NotFoundError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { throwIf } from "../utils/throwIf.js";

const getSingleUser = asyncHandler(async (req, res) => {
  const userName = req.params.userName;

  const user = await User.findOne({ userName }).select("-password");

  throwIf(!user, new NotFoundError("User not found"));

  // Fetch user's posts with comments and populated likes
  const posts = await Post.aggregate([
    {
      $match: {
        author: user._id,
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
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$post", "$$postId"] },
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
            $lookup: {
              from: "likes",
              localField: "likes",
              foreignField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "likes.likedBy",
              foreignField: "_id",
              as: "likeUsers",
            },
          },
          {
            $addFields: {
              likes: {
                $map: {
                  input: "$likes",
                  as: "like",
                  in: {
                    likedBy: {
                      $let: {
                        vars: {
                          user: {
                            $arrayElemAt: [
                              "$likeUsers",
                              {
                                $indexOfArray: [
                                  "$likeUsers._id",
                                  "$$like.likedBy",
                                ],
                              },
                            ],
                          },
                        },
                        in: {
                          _id: "$$user._id",
                          userName: "$$user.userName",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              content: 1,
              "author.userName": 1,
              "author._id": 1,
              createdAt: 1,
              parentComment: 1,
              replies: 1,
              likeCount: { $size: "$likes" },
              likes: 1,
            },
          },
          {
            $project: {
              likeUsers: 0, // Exclude likeUsers in a separate stage
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
      $lookup: {
        from: "users",
        localField: "likes.likedBy",
        foreignField: "_id",
        as: "likeUsers",
      },
    },
    {
      $addFields: {
        likes: {
          $map: {
            input: "$likes",
            as: "like",
            in: {
              likedBy: {
                $let: {
                  vars: {
                    user: {
                      $arrayElemAt: [
                        "$likeUsers",
                        {
                          $indexOfArray: ["$likeUsers._id", "$$like.likedBy"],
                        },
                      ],
                    },
                  },
                  in: {
                    _id: "$$user._id",
                    userName: "$$user.userName",
                  },
                },
              },
            },
          },
        },
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
        likes: 1,
      },
    },
    {
      $project: {
        likeUsers: 0, // Exclude likeUsers in a separate stage
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  // Build comment tree for each post
  posts.forEach((post) => {
    const commentMap = {};
    const topLevelComments = [];

    post.comments.forEach((comment) => {
      comment.replies = []; // Initialize as empty to avoid raw _ids
      commentMap[comment._id.toString()] = comment;
    });

    post.comments.forEach((comment) => {
      if (!comment.parentComment) {
        topLevelComments.push(comment);
      } else {
        const parentId = comment.parentComment.toString();
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(comment);
        }
      }
    });

    post.comments = topLevelComments;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...user._doc, posts },
        "User and posts fetched successfully"
      )
    );
});

const getAllUser = asyncHandler(async (req, res) => {
  const { query } = req.query;

  let matchStage = { isSuspended: false, isVerified: true };
  if (query) {
    matchStage = {
      ...matchStage,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    };
  }

  const users = await User.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "posts",
        let: { userId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$author", "$$userId"] },
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
            $lookup: {
              from: "comments",
              let: { postId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$post", "$$postId"] },
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
                  $lookup: {
                    from: "likes",
                    localField: "likes",
                    foreignField: "_id",
                    as: "likes",
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "likes.likedBy",
                    foreignField: "_id",
                    as: "likeUsers",
                  },
                },
                {
                  $addFields: {
                    likes: {
                      $map: {
                        input: "$likes",
                        as: "like",
                        in: {
                          likedBy: {
                            $let: {
                              vars: {
                                user: {
                                  $arrayElemAt: [
                                    "$likeUsers",
                                    {
                                      $indexOfArray: [
                                        "$likeUsers._id",
                                        "$$like.likedBy",
                                      ],
                                    },
                                  ],
                                },
                              },
                              in: {
                                _id: "$$user._id",
                                userName: "$$user.userName",
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
                {
                  $project: {
                    content: 1,
                    "author.userName": 1,
                    "author._id": 1,
                    createdAt: 1,
                    parentComment: 1,
                    replies: 1,
                    likeCount: { $size: "$likes" },
                    likes: 1,
                  },
                },
                {
                  $project: {
                    likeUsers: 0, // Exclude likeUsers in a separate stage
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
            $lookup: {
              from: "users",
              localField: "likes.likedBy",
              foreignField: "_id",
              as: "likeUsers",
            },
          },
          {
            $addFields: {
              likes: {
                $map: {
                  input: "$likes",
                  as: "like",
                  in: {
                    likedBy: {
                      $let: {
                        vars: {
                          user: {
                            $arrayElemAt: [
                              "$likeUsers",
                              {
                                $indexOfArray: [
                                  "$likeUsers._id",
                                  "$$like.likedBy",
                                ],
                              },
                            ],
                          },
                        },
                        in: {
                          _id: "$$user._id",
                          userName: "$$user.userName",
                        },
                      },
                    },
                  },
                },
              },
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
              likes: 1,
            },
          },
          {
            $project: {
              likeUsers: 0, // Exclude likeUsers in a separate stage
            },
          },
          { $sort: { createdAt: -1 } },
        ],
        as: "posts",
      },
    },
    { $project: { password: 0, refreshToken: 0 } },
  ]);

  throwIf(!users || users.length === 0, new NotFoundError("No users found"));

  // Build comment tree for each user's posts
  users.forEach((user) => {
    user.posts.forEach((post) => {
      const commentMap = {};
      const topLevelComments = [];

      post.comments.forEach((comment) => {
        comment.replies = []; // Initialize as empty
        commentMap[comment._id.toString()] = comment;
      });

      post.comments.forEach((comment) => {
        if (!comment.parentComment) {
          topLevelComments.push(comment);
        } else {
          const parentId = comment.parentComment.toString();
          if (commentMap[parentId]) {
            commentMap[parentId].replies.push(comment);
          }
        }
      });

      post.comments = topLevelComments;
    });
  });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users and posts fetched successfully"));
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userName = req.userName;

  const user = await User.findOne({ userName }).select("-password");

  throwIf(!user, new NotFoundError("User not found"));

  // Fetch user's posts with comments and populated likes
  const posts = await Post.aggregate([
    {
      $match: {
        author: user._id,
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
      $lookup: {
        from: "comments",
        let: { postId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$post", "$$postId"] },
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
            $lookup: {
              from: "likes",
              localField: "likes",
              foreignField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "likes.likedBy",
              foreignField: "_id",
              as: "likeUsers",
            },
          },
          {
            $addFields: {
              likes: {
                $map: {
                  input: "$likes",
                  as: "like",
                  in: {
                    likedBy: {
                      $let: {
                        vars: {
                          user: {
                            $arrayElemAt: [
                              "$likeUsers",
                              {
                                $indexOfArray: [
                                  "$likeUsers._id",
                                  "$$like.likedBy",
                                ],
                              },
                            ],
                          },
                        },
                        in: {
                          _id: "$$user._id",
                          userName: "$$user.userName",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              content: 1,
              "author.userName": 1,
              "author._id": 1,
              createdAt: 1,
              parentComment: 1,
              replies: 1,
              likeCount: { $size: "$likes" },
              likes: 1,
            },
          },
          {
            $project: {
              likeUsers: 0, // Exclude likeUsers in a separate stage
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
      $lookup: {
        from: "users",
        localField: "likes.likedBy",
        foreignField: "_id",
        as: "likeUsers",
      },
    },
    {
      $addFields: {
        likes: {
          $map: {
            input: "$likes",
            as: "like",
            in: {
              likedBy: {
                $let: {
                  vars: {
                    user: {
                      $arrayElemAt: [
                        "$likeUsers",
                        {
                          $indexOfArray: ["$likeUsers._id", "$$like.likedBy"],
                        },
                      ],
                    },
                  },
                  in: {
                    _id: "$$user._id",
                    userName: "$$user.userName",
                  },
                },
              },
            },
          },
        },
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
        likes: 1,
      },
    },
    {
      $project: {
        likeUsers: 0, // Exclude likeUsers in a separate stage
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  // Build comment tree for each post
  posts.forEach((post) => {
    const commentMap = {};
    const topLevelComments = [];

    post.comments.forEach((comment) => {
      comment.replies = []; // Initialize as empty
      commentMap[comment._id.toString()] = comment;
    });

    post.comments.forEach((comment) => {
      if (!comment.parentComment) {
        topLevelComments.push(comment);
      } else {
        const parentId = comment.parentComment.toString();
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(comment);
        }
      }
    });

    post.comments = topLevelComments;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { ...user._doc, posts },
        "Profile info and posts retrieved successfully"
      )
    );
});

export { getAllUser, getSingleUser, getUserProfile };
