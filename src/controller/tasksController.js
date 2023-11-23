const tasksController = require('express').Router();
const path = require('path');
const fs = require('fs');
const validator = require('../helpers/validator');

tasksController.get('/tasks',(req,res)=>{
    let result = readDataFromFile();
    if(result){
        return res.status(200).send(result);
    }else{
        return res.status(404).send("No data found");
    }
    
});

tasksController.get('/tasks/:taskId',(req,res)=>{
    let taskIdInRequest = req.params.taskId;
    let data = readDataFromFile();
    let resultData = data.tasks.filter(val => val.taskId == taskIdInRequest);
    data.tasks = resultData;
    if(resultData){
        return res.status(200).send(data);
    }else{
        return res.status(404).send("No data found for this id");
    }
    
});

tasksController.post('/tasks',(req,res)=>{
    let taskDetails = req.body;
    let taskDataModified = readDataFromFile();
    if(validator.validateIdInTaskInfo(taskDetails,taskDataModified)){
        return res.status(400).send("Request you sent has something incorrect");
    }else if(validator.validateTaskRequestInfo(taskDetails)){
        return res.status(400).send("Request is missing few fields.");
    }else if(validator.validateFlagInRequest(taskDetails)){
        return res.status(400).send("Invalid value passed into the flag. Possible values are 'Yet To Start','In progress' or 'Completed'");
    }else{
        taskDataModified.tasks.push(taskDetails);
        taskDataModified.tasks.sort((ele1,ele2 )=> ele1.taskId - ele2.taskId);
        writeIntoFile(taskDataModified);
        return res.status(200).send('Task has been added');
    }
});


tasksController.put('/tasks/:taskId',(req,res)=>{
    let taskIdInRequest = req.params.taskId;
    let taskBody = req.body;
    let taskDataModified = readDataFromFile();
    if(validator.validateTaskRequestInfo(taskBody)){
        return res.status(400).send("Request is missing few fields.");
    }else if(validator.validateFlagInRequest(taskBody)){
        return res.status(400).send("Invalid value passed into the flag. Possible values are 'Yet To Start','In progress' or 'Completed'");
    }
    taskDataModified.tasks.forEach(element => {
        if(element.taskId == taskIdInRequest){
            element.flag = taskBody.flag;
            element.title = taskBody.title;
            element.description = taskBody.description;
        }
    });
    taskDataModified.tasks.sort((ele1,ele2 )=> ele1.taskId - ele2.taskId);
    writeIntoFile(taskDataModified);
    return res.status(200).send('Task has been Updated');
});

tasksController.delete('/tasks/:taskId',(req,res)=>{
    let taskIdInRequest = req.params.taskId;
    let taskDataModified = readDataFromFile();
    let data = taskDataModified.tasks.find(val => val.taskId == taskIdInRequest);
    if(data){
        let result = taskDataModified.tasks.filter(val => val.taskId != taskIdInRequest);  
        taskDataModified.tasks = result;
        taskDataModified.tasks.sort((ele1,ele2 )=> ele1.taskId - ele2.taskId);
        writeIntoFile(taskDataModified);
        return res.status(200).send('Task has been Deleted');
    }else{
        return res.status(404).send("No data found for this id");
    }

});

function readDataFromFile(){
    let readPath = path.join(__dirname, 'tasks.json');
    let tasksData = fs.readFileSync(readPath,{encoding: 'utf-8', flag: 'r'});
    return JSON.parse(tasksData);
}
function writeIntoFile(obj){
    let writePath = path.join(__dirname, '.', 'tasks.json');
    fs.writeFileSync(writePath, JSON.stringify(obj),{encoding: 'utf8',flag:'w'});
}

module.exports = tasksController;