const express=require('express');
const route=express.Router();
const userController=require('../controllers/user.controller');
const authMw=require('../middlewares/authwt.mw');
const auth_mw=require('../middlewares/auth.mw')


route.get('/users',[authMw.verifyToken , authMw.isAdmin], userController.find);
route.get('/users/:userId',[authMw.verifyToken , authMw.isAdmin], userController.findById);
route.put('/users/:userId',[authMw.verifyToken , authMw.isAdmin, auth_mw.validateUserStatusANDuserType], userController.update);

module.exports=route;