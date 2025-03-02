const express = require('express')
const route = express.Router()

const taskController = require('./task-controller');
const VerifyJwtToken = require('../jwt/verifyAccessToken');

//Create task
route.post('/createTask',taskController.createTask);
//Get task
route.get('/getTasks',taskController.getTasks);
route.get('/getTaskByUser',taskController.getTaskByUser);
//Update task
route.put('/updateTask/:task_id',VerifyJwtToken,taskController.updateTask);
//Delete task
route.delete('/deleteTask/:task_id',VerifyJwtToken,taskController.deleteTask);



module.exports = route; 