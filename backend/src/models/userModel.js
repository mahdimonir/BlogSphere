import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Number,
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
  },
  resetPasswordOTP: {
    type: String,
  },
  resetPasswordOTPExpires: {
    type: Number,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (
    !this.password ||
    typeof this.password !== "string" ||
    this.password.trim() === ""
  ) {
    throw new Error("Password cannot be empty or undefined");
  }

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(new Error("Failed to hash password: " + error.message));
  }
});

// Verify password
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!password) {
    throw new Error("Provided password is missing or empty");
  }
  if (!this.password) {
    throw new Error("Stored password hash is missing");
  }
  return await bcrypt.compare(password, this.password);
};

// Generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

export const User = mongoose.model("User", userSchema);
