import fs from "fs";
import path from "path";
import swaggerAutogen from "swagger-autogen";

const swaggerAutogenInstance = swaggerAutogen();
const outputFile = "./src/swagger-output.json";
const endpointsFiles = ["./src/app.js"];

// Validate endpointsFiles
endpointsFiles.forEach((file) => {
  const filePath = path.resolve(file);
  if (!fs.existsSync(filePath)) {
    console.warn(
      `Warning: File ${filePath} does not exist. Creating a dummy file.`
    );
    fs.writeFileSync(filePath, "// Dummy file for swagger-autogen\n");
  }
});

const doc = {
  openapi: "3.0.0",
  info: {
    title: "BlogSphere API",
    description: "API Documentation for BlogSphere application",
    version: "1.0.0",
  },
  host:
    process.env.NODE_ENV === "production"
      ? "blog-sphere-backend-ruby.vercel.app"
      : "localhost:8000",
  schemes: [process.env.NODE_ENV === "production" ? "https" : "http"],
  basePath: "/api/v1",
  consumes: ["application/json", "multipart/form-data"],
  produces: ["application/json"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "Enter token in format: Bearer <token>",
    },
  },
  definitions: {
    ApiResponse: {
      status: { type: "integer", example: 200 },
      data: { type: "object" },
      message: { type: "string", example: "Operation successful" },
    },
    User: {
      _id: { type: "string", example: "60d21b4667d0d8992e610c84" },
      name: { type: "string", example: "John Doe" },
      email: { type: "string", example: "john@example.com" },
      userName: { type: "string", example: "johndoe" },
      avatar: { type: "string", example: "https://example.com/avatar.png" },
      role: { type: "string", example: "user" },
    },
    Post: {
      _id: { type: "string", example: "60d21b4667d0d8992e610c85" },
      title: { type: "string", example: "My First Post" },
      content: { type: "string", example: "This is the content of my post." },
      author: { $ref: "#/definitions/User" },
      image: { type: "string", example: "https://example.com/image.png" },
      catagory: { type: "string", example: "Tech" },
      tags: {
        type: "array",
        items: { type: "string" },
        example: ["tech", "blog"],
      },
      contentTable: { type: "string", example: "Table of contents" },
    },
    Comment: {
      _id: { type: "string", example: "60d21b4667d0d8992e610c86" },
      content: { type: "string", example: "Great post!" },
      author: { $ref: "#/definitions/User" },
      postId: { type: "string", example: "60d21b4667d0d8992e610c85" },
      parentCommentId: { type: "string", example: null },
      depth: { type: "integer", example: 0 },
    },
  },
  paths: {
    "/auth/update-user": {
      patch: {
        tags: ["Auth"],
        summary: "Update user information",
        description:
          "Updates the authenticated user’s profile details (name, email, or username). At least one field must be provided.",
        security: [{ BearerAuth: [] }],
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", description: "User's full name" },
                  email: {
                    type: "string",
                    description: "User's email address",
                  },
                  userName: { type: "string", description: "User's username" },
                },
                example: {
                  name: "John Doe",
                  email: "john.doe@example.com",
                  userName: "johndoe",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Profile updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input or no fields provided" },
          409: { description: "Email or username already taken" },
          404: { description: "User not found" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/auth/update-avatar": {
      patch: {
        tags: ["Auth"],
        summary: "Update user avatar",
        description: "Updates the authenticated user’s avatar image.",
        security: [{ BearerAuth: [] }],
        consumes: ["multipart/form-data"],
        produces: ["application/json"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  avatar: {
                    type: "string",
                    format: "binary",
                    description: "Avatar image file (e.g., PNG, JPEG)",
                  },
                },
                required: ["avatar"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Avatar updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Avatar missing or invalid file type" },
          404: { description: "User not found" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/posts": {
      post: {
        tags: ["Posts"],
        summary: "Create a new post",
        description:
          "Creates a new post with optional image upload. Requires authentication.",
        security: [{ BearerAuth: [] }],
        consumes: ["multipart/form-data"],
        produces: ["application/json"],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Title of the post" },
                  content: {
                    type: "string",
                    description: "Content of the post",
                  },
                  catagory: {
                    type: "string",
                    description: "Category of the post",
                  },
                  tags: { type: "string", description: "Comma-separated tags" },
                  contentTable: {
                    type: "string",
                    description: "Content table for the post",
                  },
                  image: {
                    type: "string",
                    format: "binary",
                    description: "Optional post image (e.g., PNG, JPEG)",
                  },
                },
                required: ["title", "content"],
                example: {
                  title: "My First Post",
                  content: "This is the content of my post.",
                  catagory: "Tech",
                  tags: "tech, blog",
                  contentTable: "Table of contents",
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Post created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: {
            description: "Invalid input (e.g., missing title or content)",
          },
          401: { description: "Unauthorized" },
          500: { description: "Image upload failed" },
        },
      },
    },
    "/comments": {
      post: {
        tags: ["Comments"],
        summary: "Create a top-level comment",
        description: "Creates a new top-level comment on a post.",
        security: [{ BearerAuth: [] }],
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  postId: {
                    type: "string",
                    description: "ID of the post to comment on",
                  },
                  content: {
                    type: "string",
                    description: "Content of the comment",
                  },
                },
                required: ["postId", "content"],
                example: {
                  postId: "60d21b4667d0d8992e610c85",
                  content: "Great post!",
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Comment created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: {
            description: "Invalid input (e.g., missing postId or content)",
          },
          404: { description: "Post not found" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/comments/replies": {
      post: {
        tags: ["Comments"],
        summary: "Create a nested comment (reply)",
        description:
          "Creates a nested comment as a reply to an existing comment (max depth: 5).",
        security: [{ BearerAuth: [] }],
        consumes: ["application/json"],
        produces: ["application/json"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  parentCommentId: {
                    type: "string",
                    description: "ID of the parent comment",
                  },
                  content: {
                    type: "string",
                    description: "Content of the reply",
                  },
                },
                required: ["parentCommentId", "content"],
                example: {
                  parentCommentId: "60d21b4667d0d8992e610c86",
                  content: "Thanks for the insight!",
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Reply created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input or max depth exceeded" },
          404: { description: "Parent comment or post not found" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/comments/{commentId}": {
      patch: {
        tags: ["Comments"],
        summary: "Update a comment",
        description: "Updates the content of an existing comment.",
        security: [{ BearerAuth: [] }],
        consumes: ["application/json"],
        produces: ["application/json"],
        parameters: [
          {
            in: "path",
            name: "commentId",
            description: "ID of the comment to update",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  content: {
                    type: "string",
                    description: "Updated content of the comment",
                  },
                },
                required: ["content"],
                example: {
                  content: "Updated comment content",
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Comment updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/definitions/ApiResponse" },
              },
            },
          },
          400: { description: "Invalid input (e.g., missing content)" },
          403: { description: "Unauthorized (not comment owner)" },
          404: { description: "Comment not found" },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
};

// Generate Swagger documentation and log result
try {
  swaggerAutogenInstance(outputFile, endpointsFiles, doc)
    .then(() => {
      console.log(`Swagger documentation generated at ${outputFile}`);
    })
    .catch((err) => {
      console.error("Error generating Swagger documentation:", err);
    });
} catch (err) {
  console.error("Fatal error in swagger-autogen execution:", err);
}
