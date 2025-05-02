import { Router } from "express";
import {
  getSuspendedComments,
  getSuspendedPosts,
  getSuspendedUsers,
  toggleCommentSuspension,
  togglePostSuspension,
  toggleUserSuspension,
} from "../controllers/adminController.js";
import { authorized, verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.use(verifyJWT);
router.use(authorized(["admin"]));

// User routes
router.route("/suspension/user/:userId").patch(toggleUserSuspension);
router.route("/suspend/users").get(getSuspendedUsers);

// Post routes
router.route("/suspension/post/:postId").patch(togglePostSuspension);
router.route("/suspend/posts").get(getSuspendedPosts);

// Comment routes
router.route("/suspension/comment/:commentId").patch(toggleCommentSuspension);
router.route("/suspend/comments").get(getSuspendedComments);

export default router;
