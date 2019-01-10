const taskRouter = require('express').Router();
const { getTasksByUser, postTaskByUser } = require('../../db/dbAPI');
const passport = require('../passport');
const testSafety = require('../util/safety');
const bcrypt = require('bcryptjs');


taskRouter.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    console.log('--------------------- get get get');
  let userID = req.session.passport.user._id;
  let encryptedUserID = 
  getTasksByUser(userID, function(data){
    res.send(data);
  })
});

// post a task to an existing user
taskRouter.post('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
  console.log('POST POST POST POST POST POST POST')
  const userID = req.body.userID;
  const date = req.body.date;
  const duration = req.body.duration;
  const subject = req.body.subject;
  const assign = req.body.assign;
  const notes = req.body.notes;
  let allData = [userID, date, duration, subject, assign, notes];
  console.log(allData);
  console.log('checking safety', testSafety(allData));
  if (!testSafety(allData)) {
    res.send('Please don\'t hack me; I\'m new!');
    return;
  }

  postTaskByUser([userID, date, duration, subject, assign, notes], () => {
    // console.log('====================================', userID);
    getTasksByUser(userID, function(data){
      res.send(data);
    })
  });
})



module.exports = taskRouter;
