import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";

export const useProblemStore = create((set) => ({
  problems: [],
  problem: null,
  solvedProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,

  getAllProblem: async () => {
    try {
      set({ isProblemsLoading: true });
      const response = await axiosInstance.get("/problems/get-all-problems");
      console.log("Response data by getAllPRoblem: ", response);

      set({ problems: response.data.problems });
    } catch (error) {
      console.error("Error fetching all problems", error);
      toast.error("Error getting all problems");
    } finally {
      set({ isProblemsLoading: false });
    }
  },
  getProblemById: async (id) => {
    try {
      set({ isProblemLoading: true });
      const response = await axiosInstance.get(`/problems/get-problem/${id}`);
      set({ problem: response.data.problem });
    } catch (error) {
      console.error("Error fetching a problem by id", error);
      toast.error("Error getting problem by id");
    } finally {
      set({ isProblemLoading: false });
    }
  },
  getSolvedProblemByUser: async (id) => {
    try {
      const response = await axiosInstance.get("/problems/get-solved-problems");
      set({ solvedProblems: response.data.solvedProblems });
    } catch (error) {
      console.error("Error fetching solved problem by id", error);
      toast.error("Error getting solved problem by id");
    }
  },
}));
