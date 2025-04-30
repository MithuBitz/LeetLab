import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routers/auth.routes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Enable cookies
app.use(cookieParser());

//Rotes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/problems", )

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
