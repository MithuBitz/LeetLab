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
- 