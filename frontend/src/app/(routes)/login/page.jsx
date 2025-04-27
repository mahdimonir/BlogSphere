"use client";

import { API_URL } from "@/server.js";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import GoogleButton from "../../shared/components/google-button/index.jsx";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [userEmail, setUserEmail] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const router = useRouter();

  // Initialize useForm
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  // Initialize rememberMe and log initial state
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedRememberMe = localStorage.getItem("rememberMe") === "true";
      console.log("Initial rememberMe from localStorage:", storedRememberMe);
      setRememberMe(storedRememberMe);
    }
  }, []);

  // Handle rememberMe checkbox change
  const handleRememberMeChange = () => {
    const newValue = !rememberMe;
    setRememberMe(newValue);
    console.log("rememberMe toggled to:", newValue);
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("rememberMe", newValue.toString());
      if (!newValue) {
        localStorage.removeItem("user");
      }
    }
  };

  // Login
  const onLogin = async ({ email, password }) => {
    try {
      setServerError("");
      setLoading(true);

      console.log("Login request payload:", { email, password, rememberMe });

      if (!password || typeof password !== "string" || password.trim() === "") {
        throw new Error("Password is required and must be a non-empty string");
      }

      const res = await axios.post(
        `${API_URL}/users/login`,
        { email, password, rememberMe },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("rememberMe", rememberMe.toString());
          if (rememberMe) {
            localStorage.setItem("user", JSON.stringify(res.data.data.user));
          } else {
            localStorage.removeItem("user");
          }
        }
        toast.success(res.data.message || "Login successful!");
        router.push("/");
      } else {
        throw new Error(res.data.message || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Request OTP for Forgot Password
  const onRequestOtp = async ({ email }) => {
    try {
      setServerError("");
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/users/forget-password`,
        { email },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        setUserEmail(email);
        setShowOtpForm(true);
        setCanResend(false);
        setTimer(60);
        toast.success(res.data.message || "OTP sent to your email!");
      } else {
        throw new Error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Something went wrong";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const onResetPassword = async ({ password, confirmPassword }) => {
    try {
      setServerError("");
      setOtpLoading(true);

      const enteredOtp = otp.join("").trim().toString();
      if (!enteredOtp || enteredOtp.length !== 4) {
        throw new Error("Please enter a complete 4-digit OTP");
      }
      if (!userEmail) {
        throw new Error("Email not found. Please start over.");
      }

      const res = await axios.post(
        `${API_URL}/users/reset-password`,
        { email: userEmail, otp: enteredOtp, password },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        setOtp(Array(4).fill(""));
        toast.success(res.data.message || "Password reset successfully!");
        setTimeout(() => {
          setShowForgotPassword(false);
          setShowOtpForm(false);
        }, 2000);
      } else {
        throw new Error(res.data.message || "Failed to reset password");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Password reset failed";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    try {
      setServerError("");
      setLoading(true);
      setCanResend(false);
      setTimer(60);

      const res = await axios.post(
        `${API_URL}/users/forget-password`,
        { email: userEmail },
        { withCredentials: true }
      );

      if (res.status === 200 && res.data.success) {
        toast.success(res.data.message || "New OTP sent successfully!");
      } else {
        throw new Error(res.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to resend OTP";
      setServerError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // OTP Input Handling
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Timer for Resend OTP
  useEffect(() => {
    let timeout;
    if (showOtpForm && timer > 0 && !canResend) {
      timeout = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timeout);
  }, [timer, showOtpForm, canResend]);

  // Check if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/me`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          router.push("/");
        }
      } catch {
        // Not authenticated, stay on page
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="w-full py-10 min-h-[100vh] bg-[#f1f1f1]">
      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            {showForgotPassword ? "Reset Your Password" : "Login to BlogSphere"}
          </h3>
          <p className="text-center text-gray-500 mb-4">
            {showForgotPassword ? (
              <>
                Remember your password?{" "}
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setShowOtpForm(false);
                    setServerError("");
                  }}
                  className="text-blue-500"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500">
                  Sign up
                </Link>
              </>
            )}
          </p>

          {!showForgotPassword ? (
            <>
              <GoogleButton />

              <div className="flex items-center my-5 text-gray-400 text-sm">
                <div className="flex-1 border-t border-gray-300" />
                <span className="px-3">or Sign in with Email</span>
                <div className="flex-1 border-t border-gray-300" />
              </div>

              <form onSubmit={handleSubmit(onLogin)}>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="support@blogsphere.com"
                  className="w-full p-2 border border-gray-300 outline-0 mb-1"
                  disabled={loading}
                  aria-label="Email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                <label className="block text-gray-700 mb-1 mt-4">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    className="w-full p-2 border border-gray-300 outline-0 mb-1"
                    disabled={loading}
                    aria-label="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                    aria-label={
                      passwordVisible ? "Hide password" : "Show password"
                    }
                  >
                    {passwordVisible ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}

                <div className="flex justify-between items-center my-4">
                  <label className="text-gray-700">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      disabled={loading}
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setServerError("");
                    }}
                    className="text-blue-500 text-sm"
                  >
                    Forgot Password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-lg cursor-pointer bg-black text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>

                {serverError && (
                  <p className="text-red-500 text-sm mt-2">{serverError}</p>
                )}
              </form>
            </>
          ) : !showOtpForm ? (
            <form onSubmit={handleSubmit(onRequestOtp)}>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="support@blogsphere.com"
                className="w-full p-2 border border-gray-300 outline-0 mb-1"
                disabled={loading}
                aria-label="Email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full text-lg cursor-pointer bg-black text-white mt-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>

              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </form>
          ) : (
            <form onSubmit={handleSubmit(onResetPassword)}>
              <h3 className="text-xl font-semibold text-center mb-4">
                Enter 4-Digit OTP and New Password
              </h3>

              <div className="flex justify-center gap-4 mb-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-14 h-14 text-center border border-gray-300 outline-none rounded text-xl"
                    disabled={otpLoading}
                    aria-label={`OTP digit ${index + 1}`}
                    onInput={(e) => {
                      if (e.target.value.length > 1)
                        e.target.value = e.target.value.slice(0, 1);
                    }}
                  />
                ))}
              </div>

              <label className="block text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full p-2 border border-gray-300 outline-0 mb-1"
                  disabled={otpLoading}
                  aria-label="New password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}

              <label className="block text-gray-700 mb-1 mt-4">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full p-2 border border-gray-300 outline-0 mb-1"
                  disabled={otpLoading}
                  aria-label="Confirm new password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                >
                  {passwordVisible ? <EyeOff /> : <Eye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}

              <button
                type="submit"
                disabled={otp.some((d) => d === "") || otpLoading}
                className="w-full text-lg cursor-pointer bg-black text-white mt-4 py-2 rounded-lg disabled:opacity-50"
              >
                {otpLoading ? "Resetting Password..." : "Reset Password"}
              </button>

              <div className="text-center text-sm mt-4">
                <button
                  className="text-blue-500 cursor-pointer disabled:opacity-50"
                  disabled={!canResend || loading}
                  onClick={resendOtp}
                >
                  {canResend
                    ? loading
                      ? "Resending..."
                      : "Resend OTP"
                    : `Resend in ${timer}s`}
                </button>
              </div>

              {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
