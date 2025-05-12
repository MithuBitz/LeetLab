import { db } from "../libs/db.js";

export const getAllSubmissions = async (req, res) => {
  //   console.log(" 🎮 Get All submission controller Hit");
  try {
    const userId = req.user.id;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      success: false,
      message: "Error while executing code",
    });
  }
};

export const getSubmissionById = async (req, res) => {
  console.log(" 🎮 Get submission by id controller Hit");
};

export const getSubmissionCountForProblem = async (req, res) => {
  console.log(" 🎮 getSubmissionCountForProblem controller Hit");
};
