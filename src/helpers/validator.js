class validator{
    static validateIdInTaskInfo(taskInRequest, taskDetails){
        let valueFound = taskDetails.tasks.some(val => val.taskId == taskInRequest.taskId);
        if(valueFound) return true;
        return false;
    }
    static validateTaskRequestInfo(taskInRequest){
        if(taskInRequest && taskInRequest.description && taskInRequest.title && (typeof(taskInRequest.flag)=="boolean")){
            return false;
        }
        return true;
    }
    static validatePriorityInRequest(taskInRequest){
        const flagStatus = ["low","medium","high"];
        if(flagStatus.indexOf(taskInRequest.priority)<0){
            return true;
        }
        return false;
    }
}

module.exports = validator;