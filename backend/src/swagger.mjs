import swaggerAutogen from "swagger-autogen";

// Dynamically set host based on NODE_ENV
const host =
  process.env.NODE_ENV === "production"
    ? "https://blog-sphere-backend-ruby.vercel.app"
    : "localhost:8000";

const doc = {
  info: {
    title: "BlogSphere API",
    description:
      "API for BlogSphere with posts, comments, likes, and user management",
    version: "1.0.0",
  },
  host: host,
  basePath: "/api/v1",
  schemes: process.env.NODE_ENV === "production" ? ["https"] : ["http"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter JWT token in format: Bearer <token>",
    },
  },
  definitions: {
    ApiResponse: {
      status: { type: "number", example: 200 },
      data: { type: "object" },
      message: { type: "string", example: "Operation successful" },
    },
    User: {
      _id: { type: "string" },
      name: { type: "string" },
      email: { type: "string" },
      userName: { type: "string" },
      avatar: { type: "string", nullable: true },
      isVerified: { type: "boolean" },
      isSuspended: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
    },
    Post: {
      _id: { type: "string" },
      title: { type: "string" },
      content: { type: "string" },
      image: { type: "string", nullable: true },
      catagory: { type: "string" },
      tags: { type: "array", items: { type: "string" } },
      status: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      author: {
        _id: { type: "string" },
        userName: { type: "string" },
      },
      likeCount: { type: "number" },
      commentCount: { type: "number" },
      comments: {
        type: "array",
        items: { $ref: "#/definitions/Comment" },
      },
      likes: {
        type: "array",
        items: {
          likedBy: {
            _id: { type: "string" },
            userName: { type: "string" },
          },
        },
      },
    },
    Comment: {
      _id: { type: "string" },
      content: { type: "string" },
      post: { type: "string" },
      parentComment: { type: "string", nullable: true },
      author: {
        _id: { type: "string" },
        userName: { type: "string" },
      },
      createdAt: { type: "string", format: "date-time" },
      replies: {
        type: "array",
        items: { $ref: "#/definitions/Comment" },
      },
      likeCount: { type: "number" },
      likes: {
        type: "array",
        items: {
          likedBy: {
            _id: { type: "string" },
            userName: { type: "string" },
          },
        },
      },
    },
    Like: {
      _id: { type: "string" },
      likedBy: {
        _id: { type: "string" },
        userName: { type: "string" },
      },
      post: { type: "string", nullable: true },
      comment: { type: "string", nullable: true },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Sign up a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          409: { description: "User already exists" },
          500: { description: "Server error" },
        },
      },
    },
    "/auth/verify": {
      post: {
        tags: ["Auth"],
        summary: "Verify user account with OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                },
                required: ["email", "otp"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Email verified",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid OTP or already verified" },
          404: { description: "User not found" },
        },
      },
    },
    "/auth/resend-otp": {
      post: {
        tags: ["Auth"],
        summary: "Resend OTP for email verification",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "New OTP sent",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Already verified" },
          404: { description: "User not found" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  userName: { type: "string" },
                  password: { type: "string" },
                  rememberMe: { type: "boolean" },
                },
                required: ["password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "User logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          401: { description: "Invalid credentials" },
          403: { description: "Email not verified" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Log out a user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "User logged out",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  refreshToken: { type: "string" },
                },
                required: ["refreshToken"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Token refreshed",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          401: { description: "Invalid or expired refresh token" },
        },
      },
    },
    "/auth/forget-password": {
      post: {
        tags: ["Auth"],
        summary: "Request password reset OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                },
                required: ["email"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset OTP sent",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "User not found" },
          429: { description: "Rate limit exceeded" },
        },
      },
    },
    "/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password with OTP",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  otp: { type: "string" },
                  password: { type: "string" },
                },
                required: ["email", "otp", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Password reset",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid password" },
          404: { description: "Invalid or expired OTP" },
        },
      },
    },
    "/auth/update-user": {
      patch: {
        tags: ["Auth"],
        summary: "Update user information",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  userName: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input" },
          404: { description: "User not found" },
        },
      },
    },
    "/auth/update-avatar": {
      patch: {
        tags: ["Auth"],
        summary: "Update user avatar",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  avatar: { type: "string", format: "binary" },
                },
                required: ["avatar"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Avatar updated",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Avatar missing or upload failed" },
          404: { description: "User not found" },
        },
      },
    },
    "/auth/delete-user": {
      delete: {
        tags: ["Auth"],
        summary: "Delete user account",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "User deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
    },
    "/admin/suspension/user/{userId}": {
      patch: {
        tags: ["Admin"],
        summary: "Toggle user suspension",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "userId",
            required: true,
            type: "string",
            description: "ID of the user",
          },
        ],
        responses: {
          200: {
            description: "User suspension toggled",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid user ID" },
          404: { description: "User not found" },
        },
      },
    },
    "/admin/suspension/post/{postId}": {
      patch: {
        tags: ["Admin"],
        summary: "Toggle post suspension",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "postId",
            required: true,
            type: "string",
            description: "ID of the post",
          },
        ],
        responses: {
          200: {
            description: "Post suspension toggled",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid post ID" },
          404: { description: "Post not found" },
        },
      },
    },
    "/admin/suspension/comment/{commentId}": {
      patch: {
        tags: ["Admin"],
        summary: "Toggle comment suspension",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "commentId",
            required: true,
            type: "string",
            description: "ID of the comment",
          },
        ],
        responses: {
          200: {
            description: "Comment suspension toggled",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid comment ID" },
          404: { description: "Comment not found" },
        },
      },
    },
    "/admin/suspend/users": {
      get: {
        tags: ["Admin"],
        summary: "Get suspended users",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "query",
            type: "string",
            description: "Search by name, email, or username",
          },
          {
            in: "query",
            name: "page",
            type: "integer",
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            type: "integer",
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Suspended users fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          500: { description: "Failed to paginate" },
        },
      },
    },
    "/admin/suspend/posts": {
      get: {
        tags: ["Admin"],
        summary: "Get suspended posts",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "search",
            type: "string",
            description: "Search by post title",
          },
          {
            in: "query",
            name: "page",
            type: "integer",
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            type: "integer",
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Suspended posts fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          500: { description: "Failed to paginate" },
        },
      },
    },
    "/admin/suspend/comments": {
      get: {
        tags: ["Admin"],
        summary: "Get suspended comments",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "query",
            type: "string",
            description: "Search by comment content",
          },
          {
            in: "query",
            name: "page",
            type: "integer",
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            type: "integer",
            description: "Number of items per page",
          },
        ],
        responses: {
          200: {
            description: "Suspended comments fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          500: { description: "Failed to paginate" },
        },
      },
    },
    "/comments": {
      post: {
        tags: ["Comments"],
        summary: "Create a top-level comment",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  postId: { type: "string" },
                  content: { type: "string" },
                },
                required: ["postId", "content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input" },
          404: { description: "Post not found" },
        },
      },
    },
    "/comments/reply": {
      post: {
        tags: ["Comments"],
        summary: "Create a nested comment (reply)",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  parentCommentId: { type: "string" },
                  content: { type: "string" },
                },
                required: ["parentCommentId", "content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Reply created",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input or max depth exceeded" },
          404: { description: "Parent comment or post not found" },
        },
      },
    },
    "/comments/update": {
      patch: {
        tags: ["Comments"],
        summary: "Update a comment",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  commentId: { type: "string" },
                  content: { type: "string" },
                },
                required: ["commentId", "content"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Comment updated",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input" },
          403: { description: "Unauthorized" },
          404: { description: "Comment not found" },
        },
      },
    },
    "/comments/{commentId}": {
      delete: {
        tags: ["Comments"],
        summary: "Delete a comment and its replies",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "commentId",
            required: true,
            type: "string",
            description: "ID of the comment",
          },
        ],
        responses: {
          200: {
            description: "Comment deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid comment ID" },
          403: { description: "Unauthorized" },
          404: { description: "Comment not found" },
        },
      },
    },
    "/comments/post/{postId}": {
      get: {
        tags: ["Comments"],
        summary: "Get comments for a post",
        parameters: [
          {
            in: "path",
            name: "postId",
            required: true,
            type: "string",
            description: "ID of the post",
          },
        ],
        responses: {
          200: {
            description: "Comments fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "Post not found" },
        },
      },
    },
    "/likes/toggle": {
      patch: {
        tags: ["Likes"],
        summary: "Toggle like on a post or comment",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  {
                    type: "object",
                    properties: {
                      postId: { type: "string" },
                    },
                    required: ["postId"],
                  },
                  {
                    type: "object",
                    properties: {
                      commentId: { type: "string" },
                    },
                    required: ["commentId"],
                  },
                ],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Like added",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          200: {
            description: "Like removed",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input" },
          404: { description: "Resource not found" },
        },
      },
    },
    "/posts": {
      post: {
        tags: ["Posts"],
        summary: "Create a new post",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  catagory: { type: "string" },
                  tags: { type: "string" },
                  contentTable: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input or image upload failed" },
          401: { description: "Unauthorized" },
        },
      },
      get: {
        tags: ["Posts"],
        summary: "Get all posts",
        parameters: [
          {
            in: "query",
            name: "page",
            type: "integer",
            description: "Page number",
          },
          {
            in: "query",
            name: "limit",
            type: "integer",
            description: "Number of items per page",
          },
          {
            in: "query",
            name: "search",
            type: "string",
            description: "Search by post title",
          },
        ],
        responses: {
          200: {
            description: "Posts retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/posts/{id}": {
      patch: {
        tags: ["Posts"],
        summary: "Update a post",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "string",
            description: "ID of the post",
          },
        ],
        requestBody: {
          required: false,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  catagory: { type: "string" },
                  tags: { type: "string" },
                  contentTable: { type: "string" },
                  image: { type: "string", format: "binary" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Post updated",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input or image upload failed" },
          403: { description: "Unauthorized" },
          404: { description: "Post not found" },
        },
      },
      delete: {
        tags: ["Posts"],
        summary: "Delete a post",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "string",
            description: "ID of the post",
          },
        ],
        responses: {
          200: {
            description: "Post deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          403: { description: "Unauthorized" },
          404: { description: "Post not found" },
        },
      },
      get: {
        tags: ["Posts"],
        summary: "Get a single post",
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            type: "string",
            description: "ID of the post",
          },
        ],
        responses: {
          200: {
            description: "Post retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "Post not found" },
        },
      },
    },
    "/posts/my-posts": {
      get: {
        tags: ["Posts"],
        summary: "Get authenticated user's posts",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            in: "query",
            name: "search",
            type: "string",
            description: "Search by post title",
          },
        ],
        responses: {
          200: {
            description: "User's posts retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
        },
      },
    },
    "/users/{userName}": {
      get: {
        tags: ["Users"],
        summary: "Get a single user and their posts",
        parameters: [
          {
            in: "path",
            name: "userName",
            required: true,
            type: "string",
            description: "Username of the user",
          },
        ],
        responses: {
          200: {
            description: "User and posts fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
    },
    "/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users and their posts",
        parameters: [
          {
            in: "query",
            name: "query",
            type: "string",
            description: "Search by name, email, or username",
          },
        ],
        responses: {
          200: {
            description: "Users and posts fetched",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "No users found" },
        },
      },
    },
    "/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Get authenticated user's profile",
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "Profile and posts retrieved",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          404: { description: "User not found" },
        },
      },
    },
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = [
  "./src/routes/authRoutes.js",
  "./src/routes/adminRoutes.js",
  "./src/routes/userRoutes.js",
  "./src/routes/postRoutes.js",
  "./src/routes/commentRoutes.js",
  "./src/routes/likeRoutes.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc);
