# task-manager-api

This API exposes endpoints to create, read, update and delete tasks. API stores these the data in a file.


## Features

Using this API, the user can:
- Retrive all the tasks.
- Retrive a task based on a task Id or priority.
- Retrive a list of tasks based on flag and also sort them based on when the task was created either in acending or decending order.
- Create, update or delete an existing task.

## API Endpoints
| Endpoint | Method Type | Description |
| -------- | ------ | ---------------- |
| /tasks | GET | Returns lists of tasks. |
| /tasks/:taskId | GET | Returns a particlar task. |
| /tasks/priority/:level | GET | Returns tasks based on priority level. |
| /tasks?filter[flag]=true&createdDate=asc | GET | Returns lists of tasks based on flag. It can also sort the list based on createdDate either in ascending or decending. |
| /tasks | POST | Create and save a new task. |
| /tasks | PUT | Update an existing task. |
| /tasks | DELETE | Delete an existing task. |


## Installation

To expose the endpoints into local, run the following commands.
```sh
npm install
node app.js
```

## License

Free ! enjoy :)
