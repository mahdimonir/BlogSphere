"use client";

import { API_URL } from "@/server";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        const { user, accessToken } = response.data.data;
        setUser(user);
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        return { success: true };
      }
    } catch (err) {
      console.error("Login failed:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
