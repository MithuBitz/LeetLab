import { db } from "../libs/db.js";

export const getAllSubmissions = async (req, res) => {
  //   console.log(" 🔨 Get All submission controller Hit");
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
      error: "Error while executing code for geting submission",
    });
  }
};

export const getSubmissionById = async (req, res) => {
  // console.log(" 🔨 Get submission by id controller Hit");

  const userId = req.user.id;
  const problemId = req.params.problemId;

  try {
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submissions by id fetched successfully",
      submissions,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      success: false,
      error: "Error while executing code for geting submission by id",
    });
  }
};

export const getSubmissionCountForProblem = async (req, res) => {
  // console.log(" 🔨 getSubmissionCountForProblem controller Hit");

  const problemId = req.params.problemId;

  try {
    const submission = await db.submission.count({
      where: {
        problemId: problemId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Submission count fetched successfully",
      count: submission,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      success: false,
      error:
        "Error while executing code for geting submission count for problem",
    });
  }
};
