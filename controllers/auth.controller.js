//Logic to the signup - Customer(A) / Enginer (P) / Admin (p)

const bcrypt=require('bcryptjs');
const User=require('../models/user.model')
const constants=require('../utils/constant');
const jwt=require('jsonwebtoken');
const config=require('../configs/auth.config');

exports.signup=async(req,res)=>{

    let userStatus=req.body.userStatus;

    if(!req.body.userType || req.body.userType==constants.userTypes.customer){
        userStatus=constants.userStatuses.approved;
    }
    else{
        userStatus=constants.userStatuses.pending;
    }

    // To store data in mongoDB
    const obj={
        name: req.body.name,
        userId: req.body.userId,
        email: req.body.email,
        userType: req.body.userType,
        password: bcrypt.hashSync(req.body.password, 8),
        userStatus: userStatus
    }

    try{
        const userCreated=await User.create(obj);
        const postRes={
            name: userCreated.name,
            userId: userCreated.userId,
            email: userCreated.email,
            userStatus: userCreated.userStatus,
            createdAt: userCreated.createdAt,
            updatedAt: userCreated.updatedAt
        }
        res.status(201).send(postRes);
    }
    catch(err){
        console.log("Error while creating user");
        return res.status(500).send({
            message: "Some internal error while creating the user"
        });
    }
}


// controller for the signIn flow
exports.signin=async(req,res)=>{

    // check if the user is present- if not return 400
    const user=await User.findOne({userId: req.body.userId});

    if(user==null){
        return res.status(400).send({
            message : `UserId Passed : ${req.body.userId} is not correct`
        });
    }
    
    // check if the user status is approved
    if(user.userStatus != constants.userStatuses.approved){
        return res.status(400).send({
            message : `Can't allow the login as the user status is not approved : current status : ${constants.userStatuses.approved}`
        });
    }

    //check if the password is matches
    const passwordIsValid=bcrypt.compareSync(req.body.password, user.password);
    if(!passwordIsValid){
        return res.status(400).send({
            accessToken:null,
            message:"Invalid password"
        });
    }

    // Generate the jwt signed token and will return that

    const token=jwt.sign({id : user.userId}, config.secret, {
            expiresIn : 120
    });

    // return the final response
    return res.status(200).send({
        name: user.name,
        userId:user.userId,
        email: user.email,
        userStatus: user.userStatus,
        accessToken: token
    });
}   
