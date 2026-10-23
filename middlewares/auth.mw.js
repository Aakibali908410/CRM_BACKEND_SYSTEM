const User=require('../models/user.model');
const constants=require('../utils/constant')


const validateUserData=async(req,res,next)=>{
    // check userName availability
    if(!req.body.name){
        return res.status(400).send({
            message:"failed! UserName is not present or empty"
        });
    }

    // check password availability
    if(!req.body.password){
        return res.status(400).send({
            message:"failed! Please enter the password"
        })
    }

    // check userId availability
    if(!req.body.userId){
        return res.status(400).send({
            message:"failed! UserId is not present or empty"
        });
    }
    
    // check userId duplication
    const user=await User.findOne({userId: req.body.userId});
    if(user != null){
        return res.status(400).send({
            message:"Failed! UserId is already registered! plase change and try."
        });
    }

    // check email Id validation
    if(!req.body.email){
        return res.status(400).send({
            message:"failed!, Email Id is not present"
        });
    }

    // check email duplication
    const userEmail=await User.findOne({email: req.body.email});
    if(userEmail != null){
        return res.status(400).send({
            message:"Failed! This Email_Id is already registered, please change and try"
        });
    }

    // check userType availability
    const PossibleUserTypes=[constants.userTypes.customer, constants.userTypes.engineer, constants.userTypes.admin];
    if(req.body.userType && !PossibleUserTypes.includes(req.body.userType)){
        return res.status(400).send({
            message:"UserType passed is invalid!... please correct and re-try"
        });
    }
    next();
}

const validateUserStatusANDuserType=async(req, res, next)=>{

    // validate userType
    const userType=req.body.userType;
    const PossibleUserTypes=[constants.userTypes.customer, constants.userTypes.engineer, constants.userTypes.admin];
    if(userType && !PossibleUserTypes.includes(userType)){
        return res.status(400).send({
            message:"User Type is invalid.Possible values CUSTOMER | ENGINER | ADMIN"
        });
    }


    // calidate userStatus
    const userStatus=req.body.userStatus;
    const PossibleUserstatues=[constants.userStatuses.approved, constants.userStatuses.pending, constants.userStatuses.blocked];
    if(userStatus && !PossibleUserstatues.includes(userStatus)){
        return res.status(400).send({
            message:"User status is Invalid. Possible values APPROVED | PENDING | BLOCKED"
        });
    }
    next();
}

module.exports={
    validateUserData : validateUserData,
    validateUserStatusANDuserType : validateUserStatusANDuserType
}