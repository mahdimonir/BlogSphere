// routes/auth.routes.js
import { Router } from "express";
import {
  getSuspendedComments,
  getSuspendedPosts,
} from "../controllers/adminController.js";
import {
  getAllUser,
  getSingleUser,
  getUserProfile,
} from "../controllers/userController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").get(getAllUser);
router.route("/:userName").get(getSingleUser);
router.route("/profile/me").get(verifyJWT, getUserProfile);

// Suspended Posts and Comments
router.route("/suspend/posts").get(verifyJWT, getSuspendedPosts);
router.route("/suspend/comments").get(verifyJWT, getSuspendedComments);
export default router;
