const config = require('./config/config');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const _ = require('lodash');
const logger = require('./util/logger');
const taskRouter = require('./api/tasks');
const userRouter = require('./api/tasks');

const app = express();
const port = config.port;
require('./middleware/middleware')(app);

let users = [];
let userid = 0;
let tasks = [];
let taskid = 0;

app.use('/', express.static(path.join(__dirname, '../build')));

app.use('/api/tasks', taskRouter);

// get request for 10 days, ending at endDate


app.post('/api/users/', (req, res) => {
  const userName = req.body.userName;
  console.log('userName submitted: ', userName);
})

app.delete('/api/tasks/:taskID', (req, res) => {
  const id = req.params.taskID;
  console.log('we are deleting: ', id);
})

// app.use('/*', express.static(path.join(__dirname, '../build')));
app.listen(port, () => {
  console.log(`server running at ${port}`);
});

app.use(function(err, req, res, next) {
  if (err) {
    console.log(err.message);
    res.status(500).send(err);
  }
})

module.exports = {
  app,
};
