class validator{

    //Validates the ID in the request with the ids in the task list
    static validateIdInTaskInfo(taskInRequest, taskDetails){
        let valueFound = taskDetails.tasks.some(val => val.taskId == taskInRequest.taskId);
        if(valueFound) return true;
        return false;
    }
    //Validates the fields that are coming in the request.
    static validateTaskRequestInfo(taskInRequest){
        if(taskInRequest && taskInRequest.description && taskInRequest.title && (typeof(taskInRequest.flag)=="boolean")){
            return false;
        }
        return true;
    }
    //Checks the value of Priority in the request.
    static validatePriorityInRequest(taskInRequest){
        const flagStatus = ["low","medium","high"];
        if(flagStatus.indexOf(taskInRequest.priority)<0){
            return true;
        }
        return false;
    }

}

module.exports = validator;