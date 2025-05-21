import { create } from "zustand";
import { toast } from "react-hot-toast";

import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigninUp: false,
  isLogingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check", {
        withCredentials: true,
      });
      console.log("Check auth response: ", response.data);
      set({ authUser: response.data.user });
    } catch (error) {
      console.log("🛑 Check auth error: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data, {
        withCredentials: true,
      });

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      });

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout", {
        withCredentials: true,
      });
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
}));
