import { Router } from "express";
import {
  createPost,
  deletePost,
  getMyPosts,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/postController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

// Post routes
router.route("/").get(getPosts).post(verifyJWT, createPost);
router.route("/my").get(verifyJWT, getMyPosts);
router
  .route("/:id")
  .get(getPost)
  .patch(verifyJWT, updatePost)
  .delete(verifyJWT, deletePost);

export default router;
