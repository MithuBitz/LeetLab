import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

// Function to sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );

  console.log("Sumission Data: ", data);
  // Here data is basically in token object
  return data;
};

export const pollBatchResult = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );
    const results = data.submissions;

    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2
      // (result) => result.status.id > 2
    );

    if (isAllDone) return results;
    // set a timer for 1 sec to avoid the overloadin of the api
    await sleep(1000);
  }
};

export const getLangunageName = (languageId) => {
  const LANGUAGE_NAME = {
    71: "PYTHON",
    62: "JAVA",
    63: "JAVASCRIPT",
  };

  return LANGUAGE_NAME[languageId] || "Unknown";
};
