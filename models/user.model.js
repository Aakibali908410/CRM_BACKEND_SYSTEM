const mongoose=require('mongoose');
const constants=require('../utils/constant');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minLength:7
    },
    userType:{
        type:String,
        enum:[constants.userTypes.customer, constants.userTypes.engineer, constants.userTypes.admin],
        required:true,
        default:constants.userTypes.customer
    },
    userStatus:{
        type:String,
        enum:[constants.userStatuses.approved, constants.userStatuses.pending, constants.userStatuses.blocked],
        required:true,
        default:constants.userStatuses.approved
    }
},{timestamps : true});

module.exports=mongoose.model('User',userSchema);