import { Router } from "express";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notificationController.js";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(verifyJWT, getNotifications)
  .patch(verifyJWT, markAllNotificationsAsRead);
router.route("/:id/read").patch(verifyJWT, markNotificationAsRead);

export default router;
