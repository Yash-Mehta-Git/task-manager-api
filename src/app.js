const express = require('express');
const routes = require('express').Router();
const tasksController = require('./controller/tasksController');
const app = express();
app.use(express.json());
app.use(routes);
let port = 3000;


function logger(req,res,next){
    console.log("Request received: ",req);
    console.log("Response sent: ",res);
    next();
}

app.use(logger);

routes.get('/', (req, res) => {
    return res.send("hello world");
});

routes.use('/taskManager/v1', tasksController);

app.listen(port, (err) => {
    if(!err) {
        console.log('Server is running on port 3000');
    }
});