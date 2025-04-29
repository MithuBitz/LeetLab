import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserRole } from "../generated/prisma/index.js";
import { db } from "../libs/db.js";

export const registerUser = async (req, res) => {
  // res.send("Register controller hit");
  // get the data from the body
  const { email, password, name } = req.body;

  //validation
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  try {
    // check if the user already exists
    const userExist = await db.user.findUnique({
      where: {
        email,
      },
    });
    // if exist return an response
    if (userExist) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    // Create a hash password to store indb
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    const newUser = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: UserRole.USER,
      },
    });

    if (!newUser) {
      return res.status(500).json({
        message: "Something went wrong",
        success: false,
      });
    }

    // create the token
    const token = jwt.sign(
      {
        id: newUser.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRY,
      }
    );

    // set the cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    // return the response
    return res.status(201).json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        image: newUser.image,
      },
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      message: "Unable to register user",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  // res.send("Login controller hit");
  const { email, password } = req.body;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      error: "Error logging in user",
    });
  }
};

export const logout = async (req, res) => {
  res.send("Logout controller hit");
};

export const check = async (req, res) => {
  res.send("Check controller hit");
};
