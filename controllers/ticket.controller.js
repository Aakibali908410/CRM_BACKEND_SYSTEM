// define the controller to create a new Ticket.
const User=require('../models/user.model');
const constants=require('../utils/constant');
const Ticket=require('../models/ticket.model');

const {randomUUID : uuidv4} =require('crypto');
const {createRedis}=require('../utils/redis.client');
const redisClient=createRedis();

const dotenv=require('dotenv');
dotenv.config();

const QUEUE_KEY = process.env.QUEUE_KEY || 'queue:notifications'


const sendMessageToRedis=async(req, Engineer, ticket)=>{
    // we need to send the ticket message to the redis queue

        //1. Locator need send the ticket message to the redis queue
        //2. Need to send the lsit of email ids: a.User b. Assigned Engineer
        const emailList=[];
        
        try{
            // We are try to get the user obj
            const user= await User.findOne({userId : req.userId});
            emailList.push(user.email);
        }
        catch(err){
            console.log("Error while fatching the user object",err.message);
        }
        if(Engineer){
            emailList.push(Engineer.email);
        }
        
        // Create the message that needs to be send to the redis queue
        const ticketLink=process.env.BASE_URL || '127.0.0.1:2006/';
        const message={
            emailList : emailList,
            ticketLink :ticketLink + "/crm/api/v1/tickets" + ticket._id
        }

        try{
            await enqueue(message);
            console.log("message passed to Redis");
        }
        catch(err){
            console.log('Error while passing th message to redis',err.message);
        }
}

// As soon as a ticket is created , it should be auto assigned to an engineer
exports.createTicket=async(req,res)=>{
    // Read the ticket req body
    const ticketObj={
        title:req.body.title,
        ticketPriority:req.body.ticketPriority,
        description:req.body.description,
        status:req.body.status,
        reporter:req.userId
    }
    
    // Create the ticket-Auto assign to the engineer id available
    const Engineer=await User.findOne({
        userType:constants.userTypes.engineer,
        userStatus:constants.userStatuses.approved
    })
    if(Engineer){
        ticketObj.assignee=Engineer.userId;
    }

    try{
        const ticket=await Ticket.create(ticketObj);
        if(ticket){
            
            await sendMessageToRedis(req,Engineer,ticket);

            return res.status(201).send(ticket);
        }
        return;
    }
    catch(err){
        console.log("Error while creating the ticket", err);
        return res.status(500).send({
            message:"Some internal server Error"
        });
    }
}


// Controller for updating the tickets
exports.updateTicket=async (req,res)=>{
    const ticket=await Ticket.findOne({_id : req.params.id});

    // which user is making the call
    const callingUserDetails=await User.findOne({
        userId : req.userId
    })

    
    // I want to check if the right user is trying to update the Ticket

    // calling user is the filler of the ticket
    //Engineer
    //Admin

    if(ticket.reporter == req.userId || callingUserDetails.userType == constants.userTypes.engineer || callingUserDetails.userType == constants.userTypes.admin){
        ticket.title = req.body.title != undefined ? req.body.title : ticket.title,
        ticket.description = req.body.description != undefined ? req.body.description : ticket.description,
        ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority,
        ticket.status = req.body.status != undefined ? req.body.status : ticket.status,
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee

        const updateTicket=await ticket.save();

        // I need to send message to both the user and engineer
        try{
            const eng_obj=await User.findOne({userId : updateTicket.assignee});
            await sendMessageToRedis(req, eng_obj, updateTicket);
        }
        catch(err){
            console.log("Error while fatching the engineer object",err.message);
        }

        return res.status(200).send(updateTicket);
    }
    else{
        return res.status(400).send({
            message: "Ticket can only updated by owner or engineer or admin"
        });
    }
}


// Fething all the tickeks :
// 1.Customers -He/she should fetch only his own list of tickeks
// 2. Engineer- He/she shold get all the Ticket assigned to them and created by them
// 3. Admin He/she should get all the tickeks irrespective

exports.AllTicket = async (req,res)=>{
    const queryObj={};
    // Fetch the user obj which is making the request

    const savedUser=await User.findOne({
        userId : req.userId
    });


    if(savedUser.userType == constants.userTypes.customer){
        // We should only return the tickets filed by this customers
        queryObj.reporter = savedUser.userId;
    }
    else if(savedUser.userType == constants.userTypes.engineer){
        // Get the tickets assigned to an Engineer
        queryObj.assignee = savedUser.userId;
    }
    else{
        // Get all the tickeks
    }

    const tickets=await Ticket.find(queryObj);
    return res.status(200).send(tickets);
}


// fetch the ticket based on the ticketId

exports.findTicketBasedOnId = async(req,res)=>{

    const ticket=await Ticket.findOne({
        _id : req.params.id
    });

    const savedUser=await User.findOne({
        userId : req.userId
    });

    if(savedUser.userType != constants.userTypes.admin || ticket.reporter == req.userId || ticket.assignee == req.userId ){
        return res.status(200).send(ticket);
    }
    else{
        return res.status(400).send({
            message:"Can't return ticket details as you are not authorized"
        })
    }

    return res.status(200).send(ticket);
}

const enqueue=async(payload)=>{
    const msg=JSON.stringify({
        id : uuidv4(),
        ts : new Date().toISOString(),
        ...payload
    });

    const len = await redisClient.rpush(QUEUE_KEY,msg);
    console.log(`[Producer] enqueued -> ${msg} queue length:${len}`);
}