const express=require('express');
const route=express.Router();
const ticketController=require('../controllers/ticket.controller');
const authMw=require('../middlewares/authwt.mw');
const verifyTicket=require('../middlewares/verifyTicket.mw')
const commentAuth=require('../middlewares/comment.mw');
const commentController=require('../controllers/comment.controller');

route.post('/tickets',[authMw.verifyToken , verifyTicket.validateTicketReqBody],ticketController.createTicket);
route.put('/tickets/:id',[authMw.verifyToken, verifyTicket.validateTicketStatus],ticketController.updateTicket);
route.get('/tickets', [authMw.verifyToken], ticketController.AllTicket);
route.get('/tickets/:id', [authMw.verifyToken] ,ticketController.findTicketBasedOnId);

route.post('/tickets/:ticketId/comments', [authMw.verifyToken, commentAuth.validateCommentReq] ,commentController.createComment);
route.get('/tickets/:ticketId/comments', [authMw.verifyToken, commentAuth.validateTicketId] ,commentController.fetchComments);

module.exports=route;