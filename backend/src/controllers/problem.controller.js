import { db } from "../libs/db";
import { getJudge0LanguageId, submitBatch } from "../libs/judge0.libs.js";

export const createProblem = async (req, res) => {
  // res.send("Problem controller hit");
  const { title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions } = req.body;

  if(req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Unauthorized - Access denied you are not an admin" });
  }

  try {
    // get all the language and solutionCode from the refferenceSolutions object
    for(const [language, solutionCode] of Object.entries(referenceSolutions)) {
      //Get the judge0 language id of the respactive language
      const languageId = await getJudge0LanguageId(language);

      if(languageId == null) {
        return res.status(400).json({ message: `Language ${language} not supported` });
      }
      //We have to create a submission for each testcase
      const submission = testcases.map(({input, output}) => ({
        source_code : solutionCode,
        language_id : languageId,
        stdin : input,
        expacted_output : output
      }))

      const submissionResult = await submitBatch(submission);

      //Extract the token from the submissionResultcr
      const token = submissionResult.map((result) => result.token)

     const result = await pollBatchResult(token);
    }
  } catch (error) {
    
  }
};

export const getAllProblems = async (req, res) => {
  res.send("Get all problems controller hit");
};

export const getProblemById = async (req, res) => {
  res.send("Get PRoblem by ID controller hit");
};

export const updateProblem = async (req, res) => {
  res.send("updateProblem controller hit");
};

export const deleteProblem = async (req, res) => {
  res.send("deleteProblem controller hit");
};

export const getAllProblemSolvedByUser = async (req, res) => {
  res.send("getAllProblemSolvedByUser controller hit");
};
