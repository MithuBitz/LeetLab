import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getAllSubmissions,
  getSubmissionById,
  getSubmissionCountForProblem,
} from "../controllers/submissions.controller.js";

const submissionRoute = express.Router();

submissionRoute.get("/get-all-submissions", authMiddleware, getAllSubmissions);

submissionRoute.get(
  "/get-submission/:problemId",
  authMiddleware,
  getSubmissionById
);

submissionRoute.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  getSubmissionCountForProblem
);

export default submissionRoute;
