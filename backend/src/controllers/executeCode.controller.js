import { db } from "../libs/db.js";
import {
  getLangunageName,
  pollBatchResult,
  submitBatch,
} from "../libs/judge0.libs.js";

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
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((resp) => resp.token);
    const results = await pollBatchResult(tokens);
    console.log("#########Result########");
    console.log(results);

    const allPassed = true;
    const detailResults = results.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output;

      // console.log(`Testcase #${i + 1} `);
      // console.log(`Input: ${stdin[i]}`);
      // console.log(`Expected Output: ${expected_output}`);
      // console.log(`Actual Output: ${stdout}`);
      // console.log(`Passed: ${passed}`);

      if (!passed) {
        allPassed = false;
      }

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compileOutput: result.compile_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    // console.log("Detail Results #### ", detailResults);

    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLangunageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailResults.map((r) => r.stdout)),
        stderr: detailResults.some((r) => r.stderr)
          ? JSON.stringify(detailResults.map((r) => r.stderr))
          : null,
        compileOutput: detailResults.some((r) => r.compileOutput)
          ? JSON.stringify(detailResults.map((r) => r.compileOutput))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailResults.some((r) => detailResults.memory)
          ? JSON.stringify(detailResults.map((r) => r.memory))
          : null,
        time: detailResults.some((r) => r.time)
          ? JSON.stringify(detailResults.map((r) => r.time))
          : null,
      },
    });

    // IF all passed testcases then mark the problem is solved fot the current user
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          userId_problemId: {
            userId,
            problemId,
          },
        },
        update: {},
        create: {
          userId,
          problemId,
        },
      });
    }

    const testCaseResults = detailResults.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await db.testCaseResult.createMany({
      data: testCaseResults,
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        testCases: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error executing code:", error);
    res.status(500).json({
      success: false,
      message: "Error while executing code",
    });
  }
};
