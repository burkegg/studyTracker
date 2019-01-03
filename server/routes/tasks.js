const taskRouter = require('express').Router();
const { getTasksByUser, postTaskByUser } = require('../../db/dbAPI');
const passport = require('../passport');
// testing id:  5c27a0259e815c6609d7e53d



taskRouter.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
  console.log('this is what the taskRouter sees');
  console.log(req.session.passport.user._id);
  let userID = req.session.passport.user._id;
  //res.write('fake data');
  getTasksByUser(userID, function(data){
    // console.log('data from tasks', data);
    res.send(data);
  })
});

// post a task to an existing user
taskRouter.post('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
  // put me back!   api/newTask/user/:userID/
  // console.log(req.body);
  console.log('POST POST POST POST POST POST POST')
  const userID = req.body.userID;
  const date = req.body.date;
  const duration = req.body.duration;
  const subject = req.body.subject;
  const assign = req.body.assign;
  const notes = req.body.notes;
  console.log('userID', userID, 'date', date, 'duration', duration, subject, assign, notes);
  console.log('request body', req.body);
  postTaskByUser([userID, date, duration, subject, assign, notes], () => {
    console.log('====================================', userID);
    getTasksByUser(userID, function(data){
      res.send(data);
    })
  });
  // res.send(req.body);
})

module.exports = taskRouter;
