const constants=require('../utils/constant')

const validateTicketReqBody=(req, res, next)=>{
    // validate if the title is present

    if(!req.body.title){
        return res.status(400).send({
            message: "Failed ! Tittle is missing"
        });
    }

    if(!req.body.description){
        return res.status(400).send({
            message: "Failed ! Description is missing"
        });
    }
    next();
}

const validateTicketStatus =(req,res,next)=>{
    const status=req.body.status;
    const statusTypes=[constants.ticketStatues.open,constants.ticketStatues.closed,constants.ticketStatues.blocked];

    if(status && !statusTypes.includes(status)){
        return res.status(400).send({
            message:"Status passed is not correct !"
        });
    }
    next();
}

module.exports={
    validateTicketReqBody : validateTicketReqBody,
    validateTicketStatus : validateTicketStatus
}