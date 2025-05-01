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

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submission/batch?base64_encoded=false`,
    submissions
  );

  // console.log(data);
  // Here data is basically in token object
  return data;
};
