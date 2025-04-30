import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem } from "../controllers/problem.controller.js";

const problemsRoutes = express.Router();

problemsRoutes.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem
);

problemsRoutes.get("/get-all-problems", authMiddleware, getAllProblems);

export default problemsRoutes;
