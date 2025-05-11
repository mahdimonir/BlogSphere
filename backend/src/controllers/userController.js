import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import { NotFoundError, ValidationError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notificationHelper.js";
import { throwIf } from "../utils/throwIf.js";

const getSingleUser = asyncHandler(async (req, res) => {
  const userName = req.params.userName;

  const user = await User.findOne({ userName }).select(
    "-password -refreshToken"
  );

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
                          name: "$$user.name",
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
              "author.name": 1,
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
              likeUsers: 0,
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
                    name: "$$user.name",
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
        "author.name": 1,
        "author._id": 1,
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        comments: 1,
        likes: 1,
      },
    },
    {
      $project: {
        likeUsers: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  // Build comment tree for each post
  posts.forEach((post) => {
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
                                name: "$$user.name",
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
                    "author.name": 1,
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
                    likeUsers: 0,
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
                          name: "$$user.name",
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
              "author.name": 1,
              "author._id": 1,
              likeCount: { $size: "$likes" },
              commentCount: { $size: "$comments" },
              comments: 1,
              likes: 1,
            },
          },
          {
            $project: {
              likeUsers: 0,
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
  const userName = req.user.userName;

  const user = await User.findOne({ userName }).select(
    "-password -refreshToken"
  );

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
                          name: "$$user.name",
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
              "author.name": 1,
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
              likeUsers: 0,
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
                    name: "$$user.name",
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
        "author.name": 1,
        "author._id": 1,
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        comments: 1,
        likes: 1,
      },
    },
    {
      $project: {
        likeUsers: 0,
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  // Build comment tree for each post
  posts.forEach((post) => {
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

const followUser = asyncHandler(async (req, res) => {
  const { userName } = req.params;
  const userId = req.userId;

  throwIf(!userName, new ValidationError("Username is required"));

  const targetUser = await User.findOne({ userName });
  throwIf(!targetUser, new NotFoundError("User not found"));
  throwIf(
    targetUser._id.toString() === userId,
    new ValidationError("Cannot follow yourself")
  );

  const currentUser = await User.findById(userId);
  throwIf(!currentUser, new NotFoundError("Current user not found"));

  const isFollowing = currentUser.following.includes(targetUser._id);

  if (isFollowing) {
    // Unfollow
    await User.findByIdAndUpdate(userId, {
      $pull: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $pull: { followers: userId },
    });
  } else {
    // Follow
    await User.findByIdAndUpdate(userId, {
      $push: { following: targetUser._id },
    });
    await User.findByIdAndUpdate(targetUser._id, {
      $push: { followers: userId },
    });

    // Notify the followed user
    await createNotification({
      userId: targetUser._id,
      message: `${req.user.userName} started following you`,
      type: "follow",
      link: `/users/${targetUser.userName}`,
    });
  }

  const updatedUser = await User.findById(userId).select("following");
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isFollowing: !isFollowing },
        isFollowing ? "Unfollowed successfully" : "Followed successfully"
      )
    );
});

export { followUser, getAllUser, getSingleUser, getUserProfile };
