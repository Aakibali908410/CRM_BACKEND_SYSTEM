const express=require('express');
const route=express.Router();
const authController=require('../controllers/auth.controller');
const verifyUserBody=require('../middlewares/auth.mw')



route.post("/auth/signup", [verifyUserBody.validateUserData], authController.signup);
route.post("/auth/signin", authController.signin);

module.exports=route;