const jwt=require('jsonwebtoken');
const user_config=require('../configs/auth.config');
const User=require('../models/user.model');
const constants=require('../utils/constant');


const verifyToken=(req,res,next)=>{
    const token=req.headers['x-access-token'];

    if(!token){
        return res.status(403).send({
            message:"No Access token passed !" 
        });
    }

    //verification of the jwt token
    jwt.verify(token, user_config.secret, (err, decoded)=>{
        if(err){
            return res.status(401).send({
                message : "UnAuthorized"
            });
        }
        req.userId=decoded.id;
        next();
    });
}

const isAdmin = async(req,res,next)=>{
    // find the user type from 
    const user=await User.findOne({userId : req.userId});

    if(user && user.userType == constants.userTypes.admin){
        next();
    }
    else{
        return res.status(403).send({
            message : "Only ADMIN role is allowed to access to this API"
        })
    }
}

module.exports={
    verifyToken : verifyToken,
    isAdmin : isAdmin
}