import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import {
  ApiError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFileFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { generateOtp, generateUsername } from "../utils/randomGenerator.js";
import { sendEmail } from "../utils/sendMail/index.js";
import { throwIf } from "../utils/throwIf.js";

// Create access token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

// Global cookie options
let options = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  maxAge: undefined, // Session cookie by default
};

// SignUp new user
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Strict validation
  throwIf(
    [name, email, password].some(
      (field) => !field || typeof field !== "string" || field.trim() === ""
    ),
    new ValidationError("All fields are required and must be non-empty strings")
  );

  // Additional password validation
  throwIf(
    password.length < 8,
    new ValidationError("Password must be at least 8 characters")
  );

  const existingUser = await User.findOne({ email });

  throwIf(
    existingUser,
    new ApiError(409, "User with this email or username already exists!")
  );

  const userName = generateUsername(name);

  const otp = generateOtp();
  const otpExpires = Date.now() + 30 * 60 * 1000;

  const user = await User.create({
    name,
    email,
    password,
    userName,
    otp,
    otpExpires,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  throwIf(
    !createdUser,
    new ApiError(500, "Something went wrong while registering the user")
  );

  try {
    await sendEmail({
      email: createdUser.email,
      subject: "OTP for email verification",
      templateName: "mail-template",
      data: {
        name: createdUser.name,
        otp: createdUser.otp,
        type: "activation",
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "OTP sent successfully on your email.",
          createdUser.isVerified
        )
      );
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    throw new DatabaseError("Error sending OTP email. Try again.");
  }
});

// Verify account by OTP
const verifyAccount = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  throwIf(!email || !otp, new ValidationError("Email and OTP are required"));

  const user = await User.findOne({ email });

  throwIf(!user, new NotFoundError("User not found"));

  throwIf(user.isVerified, new ValidationError("User already verified"));

  throwIf(user.otp?.trim() !== otp?.trim(), new ValidationError("Invalid OTP"));

  throwIf(
    Date.now() > user.otpExpires,
    new ValidationError("OTP has expired. Please request new OTP")
  );

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.isVerified, "Email verified successfully!")
    );
});

// Resend OTP
const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  throwIf(!email, new ValidationError("Email is required to resend OTP."));

  const user = await User.findOne({ email });

  throwIf(!user, new NotFoundError("User not found"));

  throwIf(
    user.isVerified,
    new ValidationError("This account has already verified.")
  );

  const newOtp = generateOtp();
  user.otp = newOtp;
  user.otpExpires = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Resend OTP for Email Verification",
      templateName: "mail-template",
      data: {
        name: user.name,
        otp: user.otp,
        type: "resendOtp",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "New OTP sent successfully to your email!"));
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    throw new DatabaseError("Failed to resend OTP. Try again.");
  }
});

// Login
const login = asyncHandler(async (req, res) => {
  const { email, userName, password, rememberMe } = req.body;

  // Strict validation
  throwIf(
    (!email && !userName) ||
      typeof password !== "string" ||
      password.trim() === "",
    new ValidationError(
      "Either email or username, and a non-empty password string are required"
    )
  );

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  // Avoid exposing user existence directly
  throwIf(!user, new ValidationError("Invalid credentials"));

  // Check if user has a password
  throwIf(
    !user.password,
    new ApiError(
      400,
      "User account is missing a password. Please reset your password."
    )
  );

  const isPasswordValid = await user.isPasswordCorrect(password);
  throwIf(!isPasswordValid, new ApiError(401, "Invalid user credentials"));

  throwIf(
    !user.isVerified,
    new ApiError(403, "Please verify your email before logging in")
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Extend maxAge for rememberMe
  const loginOptions = {
    ...options,
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : undefined, // 30 days or session
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, loginOptions)
    .cookie("refreshToken", refreshToken, loginOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

// Logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  throwIf(!incomingRefreshToken, new ApiError(401, "Unauthorized request"));

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    throwIf(!user, new ApiError(401, "Invalid refresh token"));

    throwIf(
      incomingRefreshToken !== user?.refreshToken,
      new ApiError(401, "Refresh token is expired or used")
    );

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// Forget Password
const forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  throwIf(!user, new NotFoundError("User not found"));

  throwIf(
    user.resetPasswordOTPExpires > Date.now() + 4 * 60 * 1000,
    new ApiError(429, "Please wait before requesting a new OTP")
  );

  const otp = generateOtp();
  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset OTP",
      templateName: "mail-template",
      data: {
        name: user.name,
        otp,
        type: "passwordReset",
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Password reset OTP sent!"));
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    throw new DatabaseError("Error sending OTP. Try again.");
  }
});

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  throwIf(
    !password || typeof password !== "string" || password.length < 8,
    new ValidationError("Password must be at least 8 characters")
  );

  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpires: { $gt: Date.now() },
  });

  throwIf(!user, new NotFoundError("Invalid or expired OTP"));

  user.password = password;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, "Password reset successfully!"));
});

// Update User
const updateUserInfo = asyncHandler(async (req, res) => {
  // Sanitize req.body to exclude sensitive fields
  const sensitiveFields = ["password", "refreshToken", "role"];
  const updates = Object.keys(req.body).reduce((acc, key) => {
    if (!sensitiveFields.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  // Validate updates (example for email)
  throwIf(
    updates.email && !/^\S+@\S+\.\S+$/.test(updates.email),
    new ValidationError("Invalid email format")
  );

  // Update the user
  const updateUser = await User.findByIdAndUpdate(
    req.userId,
    { $set: updates },
    { new: true }
  ).select("-password -refreshToken");

  throwIf(!updateUser, new NotFoundError("User not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, updateUser, "Profile updated successfully"));
});

// Update user avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarFile = req.files?.avatar?.[0];
  throwIf(!avatarFile, new ValidationError("Avatar file missing"));

  const avatar = await uploadOnCloudinary(avatarFile.path);
  throwIf(!avatar?.url, new ValidationError("Avatar upload failed"));

  const user = await User.findById(req.userId);
  throwIf(!user, new NotFoundError("User not found"));

  if (user.avatar) {
    const deleteResult = await deleteFileFromCloudinary(user.avatar);
  }

  user.avatar = avatar.url;
  await user.save();

  const updatedUser = await User.findById(req.userId).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  throwIf(!user, new NotFoundError("User not found"));

  if (user.avatar) {
    const deleteResult = await deleteFileFromCloudinary(user.avatar);
  }

  const deletedUser = await User.findByIdAndDelete(req.userId).select(
    "-password -refreshToken"
  );
  throwIf(!deletedUser, new NotFoundError("User not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
});

// Export all controllers
export {
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
};
