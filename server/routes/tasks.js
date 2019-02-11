const express = require('express');
const taskRouter = express.Router()
const Task = require('../database/models/task');
const passport = require('../passport');
const testSafety = require('../util/safety');

taskRouter.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    let userID = req.session.passport.user._id;
    Task.find({userID: userID}, (err, data) => {
      if (err) {
        res.sendStatus(500);
      }
      res.send(data);
    })
  }
);

// post a task to an existing user
taskRouter.post('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
  let userID = req.session.passport.user._id;
  let allData = {
    userID: userID,
    taskDate: req.body.date,
    duration: req.body.duration,
    subject: req.body.subject,
    assign: req.body.assign,
    notes: req.body.notes
  };

  let newTask = new Task(allData);

  let safetyCheckData = [];
  for (let item in allData) {
    safetyCheckData.push(allData[item]);
  }
  if (!testSafety(safetyCheckData)) {
    res.send('Please don\'t hack me; I\'m new!');
    return;
  }

  newTask.save(allData, function(data) {
    Task.find({userID: userID}, (err, data) => {
    res.send(data);
    })
  });
})

module.exports = taskRouter;
