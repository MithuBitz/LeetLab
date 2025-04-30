# Create a LeetCode clone app

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
