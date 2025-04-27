import crypto from "crypto";
import redis from "../libs/redis/index.js";
import User from "../models/User.js";
import { ValidationError } from "./errorHandler/index.js";
import { sendEmail } from "./sendMail/index.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatRegistrationData = (data, userType) => {
  const { name, email, password, phone_number, country } = data;

  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError("Missing required fields!");
  }

  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }
};

const checkOtpRestrictions = async (email, next) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try again after 30 minutes."
      )
    );
  }

  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP requests! Please wait 1 hour before trying again."
      )
    );
  }

  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError("Please wait 1 minute before requesting a new OTP.")
    );
  }
};

const trackOtpRequests = async (email, next) => {
  const key = `otp_request_count:${email}`;
  let count = parseInt((await redis.get(key)) || "0");

  if (count >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // 1 hour lock
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait 1 hour before trying again."
      )
    );
  }

  await redis.set(key, count + 1, "EX", 3600);
};

const sendOtp = async (name, email, template) => {
  const otp = crypto.randomInt(1000, 9999).toString();

  await sendEmail(email, "Verify your Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300); // expires in 5 minutes
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60); // cooldown 1 minute
};

const verifyOtp = async (email, otp, next) => {
  const stored = await redis.get(`otp:${email}`);
  if (!stored) {
    throw new ValidationError("Invalid or expired OTP.");
  }

  const attemptsKey = `otp_attempts:${email}`;
  const attempts = parseInt((await redis.get(attemptsKey)) || "0");

  if (stored !== otp) {
    if (attempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); // lock 30 mins
      await redis.del(`otp:${email}`);
      await redis.del(attemptsKey);
      throw new ValidationError(
        "Too many failed attempts. Account locked for 30 minutes."
      );
    }

    await redis.set(attemptsKey, attempts + 1, "EX", 300); // retry window 5 mins
    throw new ValidationError(`Incorrect OTP. ${2 - attempts} attempts left.`);
  }

  await redis.del(`otp:${email}`);
  await redis.del(attemptsKey);
};

const handleForgotPassword = async (req, res, next, userType) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new ValidationError("Email is required.");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new ValidationError(`${userType} not found.`);
    }

    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);

    await sendOtp(user.name, email, "forgot-password-user-mail");

    res.status(200).json({
      message: "OTP sent to email. Please verify your account.",
    });
  } catch (error) {
    next(error);
  }
};

const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      throw new ValidationError("Email and OTP are required.");
    }

    await verifyOtp(email, otp, next);

    res.status(200).json({
      message: "OTP verified. You can now reset your password.",
    });
  } catch (error) {
    next(error);
  }
};

export {
  checkOtpRestrictions,
  handleForgotPassword,
  sendOtp,
  trackOtpRequests,
  validatRegistrationData,
  verifyForgotPasswordOtp,
  verifyOtp,
};
