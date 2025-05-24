import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResult,
  submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  // res.send("Problem controller hit");
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Unauthorized - Access denied you are not an admin" });
  }

  try {
    // get all the language and solutionCode from the refferenceSolutions object
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //Get the judge0 language id of the respactive language
      const languageId = await getJudge0LanguageId(language);

      if (languageId == null) {
        return res
          .status(400)
          .json({ message: `Language ${language} not supported` });
      }
      //We have to create a submission for each testcase
      const submission = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expacted_output: output,
      }));

      const submissionResult = await submitBatch(submission);

      //Extract the token from the submissionResultcr
      const token = submissionResult.map((result) => result.token);

      const results = await pollBatchResult(token);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log("Result : ", result);
        // console.log(result);
        console.log(
          `Testcase ${
            i + 1
          } and Language ${language} ----- result ${JSON.stringify(
            result.status.description
          )}`
        );

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
      // Create and save a problem
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          testcases,
          codeSnippets,
          referenceSolutions,
          userId: req.user.id,
        },
      });

      return res.status(201).json({
        success: true,
        message: "Problem created successfully",
        problem: newProblem,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error creating problem" });
  }
};

export const getAllProblems = async (req, res) => {
  // res.send("Get all problems controller hit");
  try {
    // Fetch all problems from db
    const problems = await db.problem.findMany({
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    // If no problems found
    if (!problems || problems.length === 0) {
      return res.status(404).json({ message: "No problems found" });
    }
    // Return the problems
    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while fetching problems" });
  }
};

export const getProblemById = async (req, res) => {
  // res.send("Get PRoblem by ID controller hit");
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return res
      .status(500)
      .json({ message: "Error while fetching problem by id" });
  }
};

export const updateProblem = async (req, res) => {
  // res.send("updateProblem controller hit");

  const { id } = req.params;
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Unauthorized - Access denied you are not an admin" });
  }

  try {
    const existingProblem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!existingProblem) {
      return res.status(404).json({ message: "Problem not found to update" });
    }

    const updatedProblem = await db.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
      },
    });

    if (!updatedProblem) {
      return res.status(404).json({ message: "Update on problem failed" });
    }

    res.status(201).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.error("Error updating problem:", error);
    return res.status(500).json({ message: "Error while updating problem" });
  }
};

export const deleteProblem = async (req, res) => {
  // res.send("deleteProblem controller hit");
  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Unauthorized to delete - Access denied you are not an admin",
    });
  }

  try {
    const deletedProblem = await db.problem.delete({
      where: {
        id,
      },
    });

    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found to delete" });
    }

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({ error: "Error while deleting problem" });
  }
};

export const getAllProblemSolvedByUser = async (req, res) => {
  // res.send("getAllProblemSolvedByUser controller hit");
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: req.user.id,
          },
        },
      },
      include: {
        solvedBy: {
          where: {
            userId: req.user.id,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    console.error("Error in getting problem solved by current user:", error);
    return res
      .status(500)
      .json({ error: "Error in getting problem solved by current user" });
  }
};
