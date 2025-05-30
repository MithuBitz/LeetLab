import logger from "../../logger.js";
import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  pollBatchResult,
  submitBatch,
} from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
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
    // return res
    //   .status(403)
    //   .json({ message: "Unauthorized - Access denied you are not an admin" });
    return res
      .status(403)
      .json(
        new ApiError(
          403,
          null,
          "Unauthorized - Access denied you are not an admin"
        )
      );
  }

  try {
    // get all the language and solutionCode from the refferenceSolutions object
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //Get the judge0 language id of the respactive language
      const languageId = await getJudge0LanguageId(language);

      if (languageId == null) {
        // return res
        //   .status(400)
        //   .json({ message: `Language ${language} not supported` });

        return res
          .status(400)
          .json(new ApiError(400, null, `Language ${language} not supported`));
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
        logger.info("Result : ", result);

        logger.info(
          `Testcase ${
            i + 1
          } and Language ${language} ----- result ${JSON.stringify(
            result.status.description
          )}`
        );

        if (result.status.id !== 3) {
          // return res.status(400).json({
          //   error: `Testcase ${i + 1} failed for language ${language}`,
          // });
          return res
            .status(400)
            .json(
              new ApiError(
                400,
                null,
                `Testcase ${i + 1} failed for language ${language}`
              )
            );
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
    logger.info(error);
    // return res.status(500).json({ error: "Error creating problem" });
    return res
      .status(500)
      .json(new ApiError(500, null, "Error creating problem"));
  }
};

export const getAllProblems = async (req, res) => {
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
      // return res.status(404).json({ message: "No problems found" });
      return res.status(404).json(new ApiError(404, null, "No problems found"));
    }
    // Return the problems
    res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });
  } catch (error) {
    logger.error("Error while fetching problems");
    // return res.status(500).json({ message: "Error while fetching problems" });
    return res
      .status(500)
      .json(new ApiError(500, null, "Error while fetching problems"));
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
    logger.error("Error fetching problem by ID", error);
    // return res
    //   .status(500)
    //   .json({ message: "Error while fetching problem by id" });
    return res
      .status(500)
      .json(new ApiError(500, null, "Error fetching problem by ID"));
  }
};

export const updateProblem = async (req, res) => {
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
    // return res
    //   .status(403)
    //   .json({ message: "Unauthorized - Access denied you are not an admin" });
    return res
      .status(403)
      .json(
        new ApiError(
          403,
          null,
          "Unauthorized - Access denied you are not an admin"
        )
      );
  }

  try {
    const existingProblem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!existingProblem) {
      // return res.status(404).json({ message: "Problem not found to update" });
      return res
        .status(404)
        .json(new ApiError(404, null, "Problem not found to update"));
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
      // return res.status(404).json({ message: "Update on problem failed" });
      return res
        .status(404)
        .json(new ApiError(404, null, "Update on problem failed"));
    }

    res.status(201).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    logger.error("Error updating problem:", error);
    // return res.status(500).json({ message: "Error while updating problem" });
    return res
      .status(500)
      .json(new ApiError(500, null, "Error while updating problem"));
  }
};

export const deleteProblem = async (req, res) => {
  // res.send("deleteProblem controller hit");
  const { id } = req.params;

  if (req.user.role !== "ADMIN") {
    // return res.status(403).json({
    //   message: "Unauthorized to delete - Access denied you are not an admin",
    // });
    return res
      .status(403)
      .json(
        new ApiError(
          403,
          null,
          "Unauthorized to delete - Access denied you are not an admin"
        )
      );
  }

  try {
    const deletedProblem = await db.problem.delete({
      where: {
        id,
      },
    });

    if (!deletedProblem) {
      // return res.status(404).json({ message: "Problem not found to delete" });
      return res
        .status(404)
        .json(new ApiError(404, null, "Problem not found to delete"));
    }

    res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting problem:", error);
    // return res.status(500).json({ error: "Error while deleting problem" });
    return res
      .status(500)
      .json(new ApiError(500, null, "Error while deleting problem"));
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
    logger.error("Error in getting problem solved by current user:", error);
    // return res
    //   .status(500)
    //   .json({ error: "Error in getting problem solved by current user" });
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          null,
          "Error in getting problem solved by current user"
        )
      );
  }
};
