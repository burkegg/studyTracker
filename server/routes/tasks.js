// const taskRouter = require('express').Router();
const express = require('express');
const taskRouter = express.Router()
const Task = require('../database/models/task');
// const { getTasksByUser, postTaskByUser } = require('../../db/dbAPI');
const passport = require('../passport');
const testSafety = require('../util/safety');

taskRouter.get('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
    console.log('--xxxxxxxxxxcxcxcxcxc- get get get');
    let userID = req.session.passport.user._id;
    Task.find({userID: userID}, (err, data) => {
      console.log('THIS IS THE DATA', data);
    res.send(data);
  })
});

// post a task to an existing user
taskRouter.post('/',
  require('connect-ensure-login').ensureLoggedIn(),
  (req, res) => {
  console.log('POST POST POST POST POST POST POST')
  let userID = req.session.passport.user._id;
  console.log('subject', req.body.subject);
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
  console.log(safetyCheckData);
  console.log('checking safety', testSafety(safetyCheckData));
  if (!testSafety(safetyCheckData)) {
    res.send('Please don\'t hack me; I\'m new!');
    return;
  }

  newTask.save(allData, function(data) {
    console.log('====================================');
    Task.find({userID: userID}, (err, data) => {
      console.log('THIS IS THE DATA', data);
    res.send(data);
    })
  });
})

module.exports = taskRouter;
