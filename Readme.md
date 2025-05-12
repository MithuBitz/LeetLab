# Create a LeetCode clone app

![LeetLab](./docs/img/leetLab.jpg)

## Steps for devlopement

### Step 1:

- Create two directory one is backend and another is frontend
- In backend first run a command for initialize the npm and install required packages like express, dotenv, prisma, @prisma/client and nodemon
- Initalize the express and create a index.js file where implement the listening port
- Create a .env file in backend directory

### Step 2:

- Create a controller and routes directory in backend directory
- Create a auth.controller.js and auth.router.js file in controller directory with some initiaze code for register, login, logout and check routes and controller[Only initialize code not implement any functionality]

### Step 3:

- Initialize the prisma in backend directory with `npx prisma init` it will create a schema.prisma file in backend directory and also add a database url in .env file.
- run the docker locally
- Then install prisma in docker by running this command `docker run --name leetlab -e POSTGRES_USER=mithu -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres`
- Get the url of prisma like `DATABASE_URL="postgresql://mithu:mypassword@localhost:5432/postgres"` and add in .env file
- To initialize the prisma client first create a folder named libs and then create a file named db.js where we can set up the prisma client to store the prisma instance in a global variable and reuse it in other files.
- Create a user model inside the schema.prisma file
- run a command `npx prisma generate` to generate the prisma client
- and then run `npx prisma migrate dev` to migrate the database. and add a migration name
- run `npx prisma db push` to push the database

### Step 4:

- Implement the functionality of register user.
- We need two library to implement the functionality of register user which are bcrypt and jsonwebtoken

### Step 5:

- Implement the login and logout functionality
- Implement the auth middleware for logout
- Implement the check controller with routes

## Step 6:

- Set up the Judge0 with help of this docs [docsHere](https://github.com/judge0/judge0/blob/master/CHANGELOG.md) or [anotherDocHere](https://organic-citipati-da4.notion.site/Judge0-installation-1dae8b262f2680399590d92a04a90e3d)

## Step 7:

- Create a problems route in index.js and also create a problems.routes.js file in routes directory
- Now when we want to create a create problem route we need to first verify the user is admin or not because only admin can create a problem. So for this first call the auth middleware in "/create" route to get the user and then we need to create another middleware "checkAdmin" to verify the user is admin or not in a try/catch block.
- in "checkAdmin" first we need to grab the user id from the req.user.id and hold it in a variable like userId. and then we need to find the user in database using userId and select the role of the user. Now if user is null or user.role is not "ADMIN" return a response with status code 403 and a message "Access Denied". else next()
- now in catch part we need to return a response with status code 500 and a message "Something went wrong".
- Now create a createProblem controller in the problem.controller.js file.
- Also create and initialize a get all problems routes and a controller to get all problems, get problem by id with a controller, update problem by id route with authmidddleware, checkAdmin and a controller, delete problem by id route with authmidddleware, checkAdmin and a controller, a get solved problems route with authmiddleware and a controller getAllProblemSolvedByUser.

## Step 8:

- Create problems controller functionality. First get the all the data from the request body. Loop through each reference solution for different languages like js, python, j. Now we can get the language with help of judge0 get /languages with help of language id like id:63 for JS. In code first we need to get the title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution from req.body.
- Now need to check the use is admin or not for better security. if req.user.role is not "ADMIN" then return an 403 response with message "Access Denied".
- Create a try/catch block. First we need to destructure the reference solution object into a array of key value pairs like `[language, solutionCode]` as `for(const [language, solutionCode] of Object.entries(referenceSolution))` and then we need to get the language id from the language and then we need to get the solution code from the solutionCode.
- Now call a `getJudge0LanguageId(language)` function which is created inside the libs folder and inside the judge0.libs.js file to get the language id of judge0. In the function we can initialize a languageMap which have all required language (here in this project we use python, js and java) with their respactive language id of judge0. Then return the languageMap with help of the language which is passed as a parameter inside the function. (language name is in Uppercase so must convert the parameter to uppercase).
- now if the `getJudge0LanguageId(language)` return a null then return a response with status code 400 and a message "Language {language} not supported".
- Now create a array of submission where we map through the testcases and distructure the testcase object with {input, output} and inside the map we set the source_code to solutionCode, language_id to languageId, stdin to input and expacted_output to output. This are designed for judge0.
- Now create a submission result with help of a function called submitBatch with help of the submission array. (submitBatch is a await function). Now create this submitBatch method inside the judge0.libs.js file.
- In the submitBatch async function we need to use the submission as a parameter inside the function. Now here we need a package called axios so install it with `npm i axios`. Now we need to import axios in the judge0.libs.js file. Now create a judge0 api url variable in .env where we need to specify the url of judge0 api. Which is in our case `http://localhost:2358/`. Then with help of axios create a post request to judge0 api with the submission parameter and extract or destructed the data from the response like `` const {data}= await axios.post(`${process.env.JUDGE0_API}/submissions/batch?base64_encoded=false` , submission) ``. Now we need to get or return the token/data from the response data. (Here data is an array of token)
- We need to hit the judge0 endpoint with the submission two times. First we get the token in a array and this token helps judge0 to identify the code.
- Now we need to map through the sumbitBatch result(token) and inside the map for each result we need to extract the token and hold it in a token variable.
- Now we need to call a function pollBatchResult which take the token as a parameter and hold the function ruturn value in a result variable.
- Now lets implement the pollBatchResult function inside the judge0.libs.js file which takes a token as a parameter. Inside the function run a while loop where first we need to hit a judge0 endpoint with help of axios.get like
  ```
  await axios.get(`${process.env.JUDGE0_API_URL}/submission/batch`,{ params: { tokens: tokens.join(","), base64_encoded: false }})
  ```
  and hold it in a data variable. Then we need to get the submission from the data and hold it in a result variable.
- Now in the judge0 api call result is in status id format if the status id is 1 then it means the code is in queue and if the status id is 2 then it means the code is processing. If the the status id is not 1 and 2 it means that the code is run or say its done. So in code we need to use .every() method to check if all the status id is not 1 and 2. This means the code is done. We implement the .every method with the data submission result. And if it is true then return the result.
- Now we need to run a for loop which runs till results.length. grab the result from each index of results array and hold it in a variable as result.
- Now if the result.status.id is not equals to 3 then we need to return a response with status code 400 and a message "Submission failed".
- Now create the problem inside the database like `db.problem.create` and give the data like `{ title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolutions }` also set the userId to req.user.id.
- And return the response with status code 200 with the newly created problem data as a json and a message "Problem created successfully" and

### Here we have two backend like features one is for create problem and other is code execution part which is performed by judge0. When we create a problem it will then send to the code execution part or judge0 to execute the code. When the judge0 execute the code then it will return the return a done result to the createProblem backend. create problem backend also connected with database to store the problem data. When we send the code to the judge0 to execute at that time we dont have any connection with the judge0 backend. To solve this we need to implement those pollBatchResult and submitBatch functions so that we get some response or result(allDone) from the judge0 backend to the createProblem backend. We use judge0 because we cannot implement or execute the code in our backend.

## Step 9:

- Now lets check the create problem route with postman. with a json data like

```
{
  "title": "Add Two numbers",
  "description": "Given two numbers, return the sum of them",
  "difficulty": "EASY",
  "tags": ["math", "operator", "number"],
  "examples": {
    "PYTHON": {
      "input": "5 4",
      "output": "9",
      "explanation": "Adding 5 and 4 gives us 9"
    },
    "JAVASCRIPT": {
      "input": "-5 10",
      "output": "5",
      "explanation": "Adding -5 and 10 gives us 5"
    },
    "JAVA": {
      "input": "-5 -10",
      "output": "-15",
      "explanation": "Adding -5 and -10 gives us -15"
    },
  },
  "constraints": "-10^9 <= a, b <= 10^9",
  "testcases": [
    {
      "input": "100 200",
      "output": "300"
    },
    {
      "input": "-700 -200",
      "output": "-900"
    },
    {
      "input": "0 0",
      "output": "0"
    }
  ],
   "codeSnippets": {
      "JAVASCRIPT": "const fs = require('fs');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n    // Return the sum of a and b\n    return a + b;\n}\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(addTwoNumbers(a, b));",
      "PYTHON": "def add_two_numbers(a, b):\n    # Write your code here\n    # Return the sum of a and b\n    return a + b\n\nimport sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(add_two_numbers(a, b))",
      "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static int addTwoNumbers(int a, int b) {\n        // Write your code here\n        // Return the sum of a and b\n        return a + b;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(addTwoNumbers(a, b));\n    }\n}"
  },
  "referenceSolutions": {
      "JAVASCRIPT": "const fs = require('fs');\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(a + b);",
      "PYTHON": "import sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(a + b)",
      "JAVA": "import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int a = sc.nextInt();\n        int b = sc.nextInt();\n        System.out.println(a + b);\n    }\n}"
  }
}
```

## Judge0 need input useing fs like "const input = fs.readFileSync(0, 'utf-8').trim();". 0 in readFileSync means the we use stream as input.

- Now run the backend and login any user. But the user is now in USER. To change it again run another terminal for backend and run `npx prisma studio` to open prisma studio and change the user to ADMIN.

## Step 10:

- Now implement the functionality of getAllProblems controller. First use a try/catch block. In try block first we need to find all the problems in database useing `findMany()` method and hold the result in a variable as problems.
- If ther is no problem found then return a response with status code 404 and a message "No problems found".
- If there is problems found then return a response with status code 200 and with success, message and problems.
- Also code the catch block to return a response with status code 500 and a message "Error while fetching problems".

## Step 11:

- Now implement the functionality of getProblemById controller. First we need to grab the id from the req.params and hold it in a variable. Now use a try/catch block. In try block first we need to find the problem in database using id and hold the result in a variable as problem.
- If there is no problem found then return a response with status code 404 and a message "Problem not found".
- If there is problem found then return a response with status code 200 and with success, message and problem.
- Also code the catch block to return a response with status code 500 and a message "Error while fetching problem".

## Step 12:

- Now implement the functionality of updateProblem controller. First we need to grab the id from the req.params and also grab the req.body for update the problem. First we need to use a try/catch block. In try block first we need to find the problem in database using id and hold the result in a variable as existing problem. if problem not exist then return a response with status code 404 and a message "Problem not found".
- IF there is problem found then we need to update the problem useing 'update()' method with help of id and the data in req.body. Now we need to return a response with status code 200 and with success, message and updated problem.
- Also code the catch block to return a response with status code 500 and a message "Error while updating problem".

## Step 13:

- Now implement the functionality of deleteProblem controller. Fisrt we need to grab the id from the req.params and hold it in a variable. Now use a try/catch block. In try block first we need to find the problem in database using id and hold the result in a variable as problem.
- If there is no problem found then return a response with status code 404 and a message "Problem not found to delete".
- If found the problem then we need to delete the problem useing 'delete()' method with help of id. Now we need to return a response with status code 200 and with success, message and deleted problem.
- Also code the catch block to return a response with status code 500 and a message "Error while deleting problem".

## Now the execution of code part. Now when we give the solution code and hit the submit button then the code will be submitted to judge0 backend and then judge0 will execute the code and will return the submission result. And now we need to store that submission result in the database so we need a submission schema. And this submission result data will be used by the user and problems. And need to track each user submission like which is wrong and which is accepted. We also need a testcased table to track each testcase result. And we also need a problemSolved which will be used to track that all the problems which are solved by the user.

## Step 14:

- Create a Submission model which have the following fields like id, userId, problemId, sourceCode (Json), language, stdin(OPtional), stdout(Optional), stderr, compiledOutput, status, memory, time, createdAt, updatedAt.
- Create a relation with user and problem model with 'user' and 'problem' like
  user User @relation(fields: [userId], references: [id] , onDelete: Cascade)
  problem Problem @relation(fields: [problemId], references: [id] , onDelete: Cascade)
- Also need to add submission field in Problem and User model.
- We also need testCases in Submission model which is basically an array of TestCaseResult[] model. Beacuse we can have multiple testcases in one submission.
- In TestCaseResult model have id, submissionId, testCase(number basically because it will tell how many testcase is done by user), passed(boolean), stdout, expected, stderr, compileOutput, status, memory, time, createdAt, updatedAt.
- And create a relation with Submission with submissionId to id.
- submissionId as @@index

## Why we need testCaseResult? --> For every testcase judge0 give us result with some specific info. And we need to store all these specific info into the testCaseResult for each submission.

- Also create a ProblemSolved model which have id, userId, problemId, createdAt, updatedAt/
- Also create relation with User and Problem. Also use the ProblemSolved in User and Problem. In User the linked ProblemSolved name as problemSolved and In Problem it is as solvedBy.
- and userId and problemId must be as @@unique
- run a command `npx prisma generate` to generate the prisma client
- and then run `npx prisma migrate dev` to migrate the database. and add a migration name
- run `npx prisma db push` to push the database

## Step 15:

- Create and endpoint `execute-code` inside index.js with help of `executionRoute`.
- Create a `executeCode.routes.js` file in routes directory. Where first import express and then use the boilerPlate for this route.
- Create a post method inside the `executeCode.routes.js` file with help of `executionRoute` Which hit "/" with authmiddleware and the executeCode controller.
- Create a executeCode.controller.js file in controller directory.Where we can create a executeCode controller.
- In executeCode controller we first creat a try/catch block.
- In try block first we need to grab the source_code, language_id, stdin, expected_output and problemId from the req.body.
- Now get the userId from the req.user.id.
- Validate the test cases like if stdin is not an array or stdin.length is equal to 0 or expected_output is not an array or expected_outputs.length is not equal to stdin.length then return a response with status code 400 and a message "Invalid or Missing test cases".
- Prepare each test cases for judge0 batch submission. For this we need to map through the stdin to go each input and grab source_code, language_id and stdin as each input. Now hold it in a submission variable.
- Now send this submission to judge0 with help of submitBatch function and hold the result in a variable as submitResponse.
- Now for get all tokens we need to map through the submitResponse and grab each token and hold it in a tokens variable.
- Poll judge0 for the result of all submitted test cases with help of pollBatchResult with tokens as params function and hold the result in a result variable.
- send a response with status code 200 and a message "Code executed successfully".
- Now we can check the endpoint with help of postman. and send data in json format like
  ```
  {
    "source_code": "const fs = require('fs');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n    // Return the sum of a and b\n    return a + b;\n}\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(addTwoNumbers(a, b));",
      "PYTHON": "def add_two_numbers(a, b):\n    # Write your code here\n    # Return the sum of a and b\n    return a + b\n\nimport sys\ninput_line = sys.stdin.read()\na, b = map(int, input_line.split())\nprint(add_two_numbers(a, b))",
    "language_id": 63,
    "stdin": ["100 200", "-500 -600", "0 0"],
    "expected_output": ["300", "-1100", "0"],
    "problemId": "<need to grab from any problem id>"
  }
  ```

## Step 16:

- Now we need to analyse the test case results.
- For this first set a variable allPassed to true. Which actully means all test cases are passed.
- Now map through the results geting from pollBatchResult function. And for each result grab the stdout like `result.stdout?.trim()` and hold it in a variable as stdout.
- Now we can get the expected_output fromt the test cases with help of index which also we need to give in map function. And hold it in a variable as expected_output like `expected_output[i]?.trim()`.
- Now check if stdout is equal to expected_output then set true for a variable called passed.
- Lets console for the passed variable, input, expected_output, actual output from judge0 and also the passed variable.
- If passed is false then set allPassed to false.
- return an object according to TestCaseResult schema. like
  ```
    {
      testCase: i + 1,
      passed,
      stdout,
      ecpected: expected_output,
      stderr: result.stderr || null,
      compileOutput: result.compile_output || null,
      status: result.status.description,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined
    }
  ```
- Now store the submission result in the database like db.submission.create(). with data like userId, problemId, sourceCode, language, stdin (stdin.join("\n")), stdout, stderr, compileOutput, status, memory, time
- For language we need to create a judge0 utility to get the language name. For this utilituy we need to create a function inside the judge0.libs file which take the languageId as a parameter and inside the function create a languge name object which have all language id with their respective language name. And return the language name if languageId is present in the object. If not then return "Unknown".
- To store stdout inside the db we need to first grab the value from the detailResult variable like `detailResults.map((r) => r.stdout)` and then convert it to string with help of `JSON.stringify(detailResults.map((r) => r.stdout))`.
- To store the error we need to check the detailedResults for stderr with help of some() like `detailedResults.some((r) => r.stderr)`. If true then store the error as string useing `JSON.stringify` in the db else store null.
- To store the status according to allPassed variable we need to check if allPassed is true then store "Accepted" else store "Wrong Answer".
- Now if all passed is true then mark the problem as solved for the current user. If all passed then upsert the problemSolved table of that perticular problemId with userId. and if that perticular problemId and userId already exist then update the field but in our case we need not to be updated anything so we dont give any logic in update like `update{}` and if that perticular problemId and userId does not exist then create a new row with userId and problemId.
- Now we need to save the indivisual test case result in the db. For this first we need to map through the details results and grab each result like submission.id, testCase, passed, stdout, stderr, compileOutput, expected, status, memory, time. And then create a new test case result row with these data as db.testCaseResult.createMany().
- Now we need to save the testCases inside the submission table. For this first we need to uniquely find the submission with help of id: submission.id. And then include the testCases inside the submission with help of include: { testCases: true }.
- Now send the response with status code 200 with the submission with testcases.
- The return of runing execute code route is like
  ```
     "success": true,
    "message": "Code executed successfully",
    "submission": {
        "id": "83e317c4-acb0-4738-927e-10ac5f08e705",
        "userId": "cma85o4wd0000ysxcw7o5ym24",
        "problemId": "82e9c68e-13b1-46af-8b9f-376294e9b5cd",
        "sourceCode": "const fs = require('fs');\n\nfunction addTwoNumbers(a, b) {\n    // Write your code here\n    // Return the sum of a and b\n    return a + b;\n}\n\n// Reading input from stdin (using fs to read all input)\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst [a, b] = input.split(' ').map(Number);\n\nconsole.log(addTwoNumbers(a, b));",
        "language": "JAVASCRIPT",
        "stdin": "100 200\n-500 -600\n0 0",
        "stdout": "[\"300\",\"-1100\",\"0\"]",
        "stderr": null,
        "compileOutput": null,
        "status": "Accepted",
        "memory": null,
        "time": "[\"1.787 s\",\"2.493 s\",\"2.535 s\"]",
        "createdAt": "2025-05-12T11:10:04.547Z",
        "updatedAt": "2025-05-12T11:10:04.547Z",
        "testCases": [
            {
                "id": "049a7d2b-bef2-40d1-aa12-1f8854cdab34",
                "submissionId": "83e317c4-acb0-4738-927e-10ac5f08e705",
                "testCase": 1,
                "passed": true,
                "stdout": "300",
                "expected": "300",
                "stderr": null,
                "compileOutput": null,
                "status": "Accepted",
                "memory": "15964 KB",
                "time": "1.787 s",
                "createdAt": "2025-05-12T11:10:05.422Z",
                "updatedAt": "2025-05-12T11:10:05.422Z"
            },
  ```

## Step 17:

- Create a submission route in index.js with help of submissionRoute. Adding boiler plate code for this route with controller.
- in submission route we create a get mehtod for get all submission with help of authmiddleware and a get all submission controller.
- Also create a get method for get submission by id with help of authmiddleware and a get submission by id controller and also create a get method for get submission count for a specific problem id with help of authmiddleware and a get all the submission for problem controller.
- Now create and intialize the above controller inside submission.controller.js file.
- For the get all submission controller we create a try/catch block. In try block first we grab the userId from the req.user.id and hold it in a variable like userId.
- Then with help of findMany() inside the submission table we find all the submissions by userId and hold the result in a variable like submissions.
- Now send the response with status code 200 with the submissions.
- Implement the catch part.
