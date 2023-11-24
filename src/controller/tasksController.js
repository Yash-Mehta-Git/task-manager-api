const tasksController = require('express').Router();
const path = require('path');
const fs = require('fs');
const validator = require('../helpers/validator');

tasksController.get('/tasks',(req,res)=>{
    filterFlagParams = req.query.filter ? req.query.filter.flag: false;
    sortParams = req.query.createdDate;
    let result = readDataFromFile();  
    if(result.tasks.length > 0){        
        if(filterFlagParams){
            result.tasks = result.tasks.filter(val => val.flag +''==filterFlagParams);
        }
        if(sortParams){
            if(sortParams == 'asc'){
                result.tasks.sort((e1,e2)=>e1.createdDate - e2.createdDate);
            }else{
                result.tasks.sort((e1,e2)=>e2.createdDate - e1.createdDate);
            }
        }
        result.tasks = convertCreatedDateToISODate(result.tasks);
        return res.status(200).send(result);
    }else{
        return res.status(404).send("No data found");
    }
});


tasksController.get('/tasks/:taskId',(req,res)=>{
    let taskIdInRequest = req.params.taskId;
    let data = readDataFromFile();
    if(data.tasks.length > 0){
        let resultData = data.tasks.filter(val => val.taskId == taskIdInRequest);
        data.tasks = convertCreatedDateToISODate(resultData);
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
    }else if(validator.validatePriorityInRequest(taskDetails)){
        return res.status(400).send("Invalid value passed into the priority. Possible values are 'low','medium' or 'high'");
    }else{
        taskDetails['createdDate']=Date.now();
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
    }else if(validator.validatePriorityInRequest(taskBody)){
        return res.status(400).send("Invalid value passed into the priority. Possible values are 'low','medium' or 'high'");
    }
    if(taskDataModified.tasks.length > 0){
        if(taskDataModified.tasks.some(val => val.taskId == taskIdInRequest)){
            taskDataModified.tasks.forEach(element => {
                if(element.taskId == taskIdInRequest){
                    element.flag = taskBody.flag;
                    element.title = taskBody.title;
                    element.description = taskBody.description;
                    element.priority = taskBody.priority;
                    element.createdDate = Date.now();
                }
            });
            taskDataModified.tasks.sort((ele1,ele2)=> ele1.taskId - ele2.taskId);
            writeIntoFile(taskDataModified);
            return res.status(200).send('Task has been Updated');
        }else{
            return res.status(404).send("No data found for this id");
        }     
    }   
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

tasksController.get('/tasks/priority/:level',(req,res)=>{
    let result = readDataFromFile();
    let priorityInRequest = req.params.level;
    if(result.tasks.length > 0){
        let data = result.tasks.filter(val=> val.priority == priorityInRequest)
        result.tasks = convertCreatedDateToISODate(data); 
        return res.status(200).send(result);
    }else{
        return res.status(404).send("No data found");
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
function convertCreatedDateToISODate(obj){
    obj.forEach(element => {
        element.createdDate = new Date(element.createdDate).toDateString()
    })
    return obj;
}

module.exports = tasksController;