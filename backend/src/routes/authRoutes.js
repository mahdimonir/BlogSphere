import { Router } from "express";
import {
  deleteUser,
  forgetPassword,
  login,
  logout,
  refreshAccessToken,
  resendOtp,
  resetPassword,
  signup,
  updateUserAvatar,
  updateUserInfo,
  verifyAccount,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multerMiddleware.js";

const router = Router();

// Public routes
router.route("/signup").post(signup);
router.route("/verify").post(verifyAccount);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(login);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);

// Protected routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-user").patch(verifyJWT, updateUserInfo);
router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/delete-user").delete(verifyJWT, deleteUser);

export default router;
