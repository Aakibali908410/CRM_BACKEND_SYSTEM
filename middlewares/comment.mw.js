const Ticket=require('../models/ticket.model');

const validateCommentReq= async (req,res,next)=>{
    // validate if the ticketId is present

    if(!req.params.ticketId){
        res.status(400).send({
            message:"Failed!, Ticket id is not present in the path param"
        }); 
    }

    //Need to check if it's a valid tickek
    const ticket=await Ticket.findOne({
        _id : req.params.ticketId
    });

    if(!ticket){
        return res.status(400).send({
            message : "Failed! , Ticket id passed is not valid"
        });
    }

    // validation of content - It can't be empty
    if(!req.body.content){
        return res.status(400).send({
            message : "Failed! , content of comment can't be empty"
        });
    }
    next();
}


const validateTicketId= async (req,res,next)=>{

    //Need to check if it's a valid tickek
    const ticket=await Ticket.findOne({
        _id : req.params.ticketId
    });

    if(!ticket){
        return res.status(400).send({
            message : "Failed! , Ticket id passed is not valid"
        });
    }

    next();
}

module.exports={
    validateCommentReq : validateCommentReq,
    validateTicketId : validateTicketId
}