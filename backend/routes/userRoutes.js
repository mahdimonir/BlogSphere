const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getAllUsers,
  suspendUser,
  unsuspendUser,
  getProfile,
} = require("../controllers/userController");
const { auth, admin } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get("/all", auth, admin, getAllUsers);
router.put("/suspend/:id", auth, admin, suspendUser);
router.put("/unsuspend/:id", auth, admin, unsuspendUser);

module.exports = router;
