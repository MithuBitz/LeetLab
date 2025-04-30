import express from "express";
import {
  check,
  login,
  logout,
  registerUser,
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.get("/logout", authMiddleware, logout);

router.get("/check", authMiddleware, check);
export default router;
