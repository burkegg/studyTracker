const taskRouter = require('express').Router();
const { getTasksByUser, postTaskByUser } = require('../../db/dbAPI');


// Route path: /flights/:from-:to
taskRouter.get('/', (req, res) => {
  console.log('taskRouter accessed with ', req.body);
  let userID = req.body.userID;
  getTasksByUser(userID, function(data){
    res.send(data);
  })
}); 

// post a task to an existing user
taskRouter.post('/', (req, res) => {
  // put me back!   api/newTask/user/:userID/
  // console.log(req.body);
  console.log('POST POST POST PSOT POST POST POST')
  const userID = req.body.userID;
  const date = req.body.date;
  const duration = req.body.duration;
  const subject = req.body.subject;
  const assign = req.body.assign;
  const notes = req.body.notes;
  console.log(userID, date, duration, subject, assign, notes);
  console.log('request body', req.body);
  res.send(req.body);
})

module.exports = taskRouter;