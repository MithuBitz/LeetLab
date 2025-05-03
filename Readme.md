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
