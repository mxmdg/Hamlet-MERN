@echo off

REM Change directory to the MongoDB installation directory on the C: drive
cd /d "C:\Program Files\MongoDB"

REM Start MongoDB (Replace "mongod" with the command to start your MongoDB server)
start mongod

REM Wait for MongoDB to start (adjust the timeout as needed)
timeout /t 5

REM Change directory to your Node.js app's directory on the D: drive
cd /d "D:\Github\Hamlet-MERN\backend"

REM Start your Node.js app (Replace "node app.js" with the command to start your Node.js app)
start npm run dev

REM Wait for Node.js app to start (adjust the timeout as needed)
timeout /t 5

REM Change directory to your React app's directory on the D: drive
cd /d "D:\Github\Hamlet-MERN\frontend"

REM Start your React app (Replace "npm start" with the command to start your React app)
start npm start
