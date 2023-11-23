class validator{
    static validateIdInTaskInfo(taskInRequest, taskDetails){
        let valueFound = taskDetails.tasks.some(val => val.taskId == taskInRequest.taskId);
        if(valueFound) return true;
        return false;
    }
    static validateTaskRequestInfo(taskInRequest){
        if(taskInRequest && taskInRequest.description && taskInRequest.title && taskInRequest.flag){
            return false;
        }
        return true;
    }
    static validateFlagInRequest(taskInRequest){
        const flagStatus = ['Yet To Start','In progress','Completed'];
        if(flagStatus.indexOf(taskInRequest.flag) < 0){
            return true;
        }
        return false;
    }
}

module.exports = validator;