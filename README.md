# Task-Manager App
This is a full stack application developed with Mongo, Express, React and Nodejs.
Version used--- node - v18.20.4
                mongoDB - 6.0


# Features
User Authentication (Sign-In & Sign-Up)
Dashboard with Task Management
Add, Edit, and Delete Tasks
Task Filtering (Inbox, Today, Upcoming, Completed)
Task search (from Inbox)
Responsive UI using Bootstrap

# Technologies Used
React.js (Frontend Framework)
Node.js and Express (Backend framework)
CSS and Bootstrap (Styling)
Axios (API Requests)
React Router (Navigation)

# UI Overview
# Dashboard Layout
Left Side: Task Categories (Inbox, Today, Upcoming, Completed) 
Right Side: Task List with Actions (Edit & Delete),Search task(Inbox)
Top Right Corner: Displays logged-in user's email

# API Endpoints Used
    POST:   api/user/registration (Create new user)
    POST:   api/user/loginUser   (Get User)
    POST:   api/task/createTask (Creates a new Task )
    GET:    api/task/getTaskByUser   (Gets tasks for a tasklist for the Authorized user)
    PUT:    api/task/updateTask/:task_id (Update a Task )
    Delete: api/task/deleteTask/:task_id (Delete a task)


## Installation
After clonning the repository, following command will run both backend and frontend applications (In development mode):

npm install(Install Dependencies)
npm start(Start the React App or backend server)

Create a New React App (If Not Already Cloned)(front end)
npx create-react-app task-manager-app
cd task-manager-app

## Application folder 
TM_backend (back end code folder)
tm-frontend (front end code folder)

## Mongo URI 
In backend folder , .env file contain mongodb URL like,dbURI=mongodb://localhost:27017/taskmanager ,
before run the project create "taskmanager" database in your local system 











