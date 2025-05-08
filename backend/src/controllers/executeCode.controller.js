import { pollBatchResult, submitBatch } from "../libs/judge0.libs.js";

export const executeCode = async (req, res) => {
  //   res.send("executeCode controller hit");
  const { source_code, language_id, stdin, expected_outputs, problemId } =
    req.body;
  const userId = req.user.id;

  //validation
  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or Missing test cases",
    });
  }
  try {
    const submission = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submission);
    const tokens = submitResponse.map((resp) => resp.token);
    const results = await pollBatchResult(tokens);
    console.log("#########Result########");
    console.log(results);

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      results,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      success: false,
      message: "Error while executing code",
    });
  }
};
