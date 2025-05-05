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
  verifyAccount,
} from "../controllers/authController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/signup").post(signup);
router.route("/verify").post(verifyAccount);
router.route("/resend-otp").post(resendOtp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password").post(resetPassword);
router.route("/update").put(isAuthenticated, updateUser);
router.route("/delece").delete(isAuthenticated, deleteUser);

export default router;
