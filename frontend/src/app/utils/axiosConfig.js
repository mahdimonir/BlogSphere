import { API_URL } from "@/server";
import axios from "axios";
import { refreshAccessToken } from "./auth";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies in requests
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired access token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop
      try {
        const newAccessToken = await refreshAccessToken();
        localStorage.setItem("token", newAccessToken); // Update token in localStorage
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // Retry the original request
      } catch (err) {
        console.error("Failed to refresh token:", err);
        localStorage.removeItem("token"); // Remove invalid token
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
