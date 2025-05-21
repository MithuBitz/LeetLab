import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routers/auth.routes.js";
import problemsRoutes from "./routers/problems.routes.js";
import executionRoute from "./routers/executionCode.routes.js";
import submissionRoutes from "./routers/submission.routes.js";
import playlistRoutes from "./routers/playlist.routes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

// Enable cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Enable cookies
app.use(cookieParser());

//Rotes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", problemsRoutes);
app.use("/api/v1/execute-code", executionRoute);
app.use("/api/v1/submission-code", submissionRoutes);
app.use("/api/v1/playlist", playlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
