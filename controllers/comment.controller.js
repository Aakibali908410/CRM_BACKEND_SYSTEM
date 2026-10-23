const Comment = require('../models/comment.model');

// 1. Controller to create a comment
exports.createComment = async (req,res)=>{

    const commentObj = {
        content : req.body.content,
        ticketId : req.params.ticketId,
        commenterId : req.userId
    }

    try{
        const comment= await Comment.create(commentObj);
        return res.status(201).send(comment);
    }
    catch(err){
        console.log("some error happend when created comment",err);
        return res.status(500).send({
            message : "Some internal server error"
        });
    }
}

//2.get the comments for given Ticket
exports.fetchComments=async(req,res)=>{

    try{
        const comments=await Comment.find({ticketId : req.params.ticketId});
        return res.status(200).send(comments);
    }
    catch(err){
        console.log("some internal error,while fetching the comments",err);
        return res.status(500).send({
            message : "Some internal server error"
        });
    }
}