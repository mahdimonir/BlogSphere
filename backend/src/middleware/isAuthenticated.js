import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthError } from "../utils/errorHandler/ApiError.js";

const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(
      new AuthError("You are not logged is. Please login to access this.")
    );
  }

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AuthError("The user belonging to this token does not exist")
    );
  }

  req.user = currentUser;
  next();
});

export { isAuthenticated };
