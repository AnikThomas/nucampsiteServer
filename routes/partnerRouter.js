//Task 3: Add an Express router to handle routing for partners
const express = require('express');
const partnerRouter = express.Router();

partnerRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res)=>{
    res.end('Will send all the partners to you')
})
.post((req,res)=>{
    res.end(`Will add the partner: ${req.body.name} with description: ${req.body.description}`)
})
.put((req,res)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /partners');
})
.delete((req, res) => {
    res.end('Deleting all partners');
});

partnerRouter.route('/:partnerId')
.all((req, res, next)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res)=>{
    res.end('Will send the partner to you');
})
.post((req,res)=>{
    res.statusCode = 403;
    res.end(`POST operation not supported on /partners/:partnerId`);
})
.put((req,res)=>{    
    res.end(`Updating the partner ${req.params['partnerId']}Will update the partner description: ${req.body.description}`);  
})
.delete((req, res) => {
    res.end('Deleting partner by Id');
});

module.exports = partnerRouter;