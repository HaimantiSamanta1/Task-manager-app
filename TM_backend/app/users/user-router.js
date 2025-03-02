const express = require('express')
const route = express.Router()

const userController = require('./new-user-controller');
const VerifyJwtToken = require('../jwt/verifyAccessToken');

//Add New user
route.post('/registration',userController.userRegistration);
//User login
route.post('/loginUser',userController.loginUser);
//Delete a user 
route.delete('/deleteUserAccount/:account_id',VerifyJwtToken,userController.deleteAccount);
//User Logout
route.post('/logout',VerifyJwtToken,userController.logout);

module.exports = route; 
