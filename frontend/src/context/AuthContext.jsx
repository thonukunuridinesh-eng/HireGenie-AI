import { createContext, useContext, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/axios";

const AuthContext = createContext(null);

function getStoredJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

function getErrorMessage(error, fallbackMessage = "Something went wrong") {
  const data = error.response?.data;

  console.log("Backend error status:", error.response?.status);
  console.log("Backend error data:", data);

  if (!data) {
    return fallbackMessage;
  }

  if (data.message && !data.errors) {
    return data.message;
  }

  if (data.errors) {
    const firstKey = Object.keys(data.errors)[0];
    const firstError = data.errors[firstKey];

    if (Array.isArray(firstError)) {
      return `${firstKey}: ${firstError[0]}`;
    }

    if (typeof firstError === "string") {
      return `${firstKey}: ${firstError}`;
    }

    if (typeof firstError === "object") {
      return `${firstKey}: ${JSON.stringify(firstError)}`;
    }
  }

  if (data.message) {
    return data.message;
  }

  if (typeof data === "string") {
    return data;
  }

  return fallbackMessage;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredJson("hiregenie_user"));
  const [profile, setProfile] = useState(() =>
    getStoredJson("hiregenie_profile")
  );

  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(
    localStorage.getItem("hiregenie_access_token")
  );

  const saveAuthData = (payload) => {
    if (!payload) {
      toast.error("Invalid authentication response from backend");
      return;
    }

    const userData = payload.user;
    const profileData = payload.profile;
    const tokens = payload.tokens;

    if (!tokens?.access || !tokens?.refresh) {
      toast.error("Token data missing from backend response");
      return;
    }

    localStorage.setItem("hiregenie_access_token", tokens.access);
    localStorage.setItem("hiregenie_refresh_token", tokens.refresh);
    localStorage.setItem("hiregenie_user", JSON.stringify(userData));
    localStorage.setItem("hiregenie_profile", JSON.stringify(profileData));

    setUser(userData);
    setProfile(profileData);
  };

  const register = async (formData) => {
    setLoading(true);

    try {
      console.log("Sending register data:", formData);

      const response = await api.post("/auth/register/", formData);

      console.log("Register success:", response.data);

      saveAuthData(response.data.data);

      toast.success("Account created successfully");

      return { success: true };
    } catch (error) {
      console.log("Register error full:", error);

      const message = getErrorMessage(error, "Registration failed");

      toast.error(message);

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    setLoading(true);

    try {
      console.log("Sending login data:", formData);

      const response = await api.post("/auth/login/", formData);

      console.log("Login success:", response.data);

      saveAuthData(response.data.data);

      toast.success("Login successful");

      return { success: true };
    } catch (error) {
      console.log("Login error full:", error);

      const message = getErrorMessage(error, "Login failed");

      toast.error(message);

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (credential) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/google/", {
        id_token: credential,
      });

      saveAuthData(response.data.data);

      toast.success("Google login successful");

      return { success: true };
    } catch (error) {
      console.log("Google login error full:", error);

      const message = getErrorMessage(
        error,
        "Google login failed. Check Google Client ID."
      );

      toast.error(message);

      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get("/auth/profile/");

      const profileData = response.data.data;

      localStorage.setItem("hiregenie_profile", JSON.stringify(profileData));

      setProfile(profileData);

      return profileData;
    } catch (error) {
      console.log("Refresh profile error:", error);
      return null;
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem("hiregenie_refresh_token");

    try {
      if (refreshToken) {
        await api.post("/auth/logout/", {
          refresh: refreshToken,
        });
      }
    } catch (error) {
      console.log("Logout backend error:", error);
    }

    localStorage.removeItem("hiregenie_access_token");
    localStorage.removeItem("hiregenie_refresh_token");
    localStorage.removeItem("hiregenie_user");
    localStorage.removeItem("hiregenie_profile");

    setUser(null);
    setProfile(null);

    toast.success("Logged out successfully");
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated,
      register,
      login,
      googleLogin,
      refreshProfile,
      logout,
    }),
    [user, profile, loading, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}