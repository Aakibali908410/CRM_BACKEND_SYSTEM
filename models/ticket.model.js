const mongoose=require('mongoose');
const constants=require('../utils/constant');


const ticketSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    ticketPriority:{
        type:Number,
        required:true,
        default:4
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:constants.ticketStatues.open
    },
    reporter:{
        type:String
    },
    assignee:{
        type:String
    }
},{timestamps:true});


module.exports=mongoose.model("Ticket",ticketSchema);