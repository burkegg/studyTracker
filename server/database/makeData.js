//Connect to Mongo database
const express = require('express');
const taskRouter = express.Router()
const db = require('./')
const Task = require('./models/task');
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const moment = require('moment');
console.log('premoment');

//your local database url
//27017 is the default mongoDB port
const uri = 'mongodb://ec2-54-183-224-183.us-west-1.compute.amazonaws.com:27017/graphmytime' 


// {username}
let tasks = ['patrol bridge', 'throw rocks', 'spell', 'eat "food"'];
let username = 'Mr. T. Roll'
let _id = '5c3d3a304394f54961068c4a';


let startDate = '2018-10-01';
let daysToPost = 60;
var makeDates = function(numDates, start) {
  let dates = [];
  let s = moment(start);
  for (let i = 0; i < numDates; i++) {
    let next = s.add(1, 'days');
    next = new Date(next.format().slice(0, 10));
    dates.push(next);
  }
  console.log('dates', dates);
  return dates;
}

let days = makeDates(daysToPost, startDate);


let makeOne = function(task) {
  let entry = {userID: task.userID, taskDate: task.taskDate, duration: task.duration, subject: task.subject, assign: null, notes: '***TEST TEST***'};
  let t = new Task(entry);
  t.save();
}


let makeAll = function(datesArr, userID) {
  let allTasks = [];
  for (let dayIdx = 0; dayIdx < datesArr.length; dayIdx++) {
    let taskTimes = {
      English: 60 - Math.ceil(Math.random() * 30),
      History: 40 - Math.ceil(Math.random() * 10),
      Math: 30 - Math.ceil(Math.random() * 25),
      Science: 40 - Math.ceil(Math.random() * 30),
    }
    for (let task in taskTimes){
      if (moment(datesArr[dayIdx]).day() === 5 && task === 'Math') {
        continue;
      }
      if (moment(datesArr[dayIdx]).day() === 5 && task === 'Science') {
        continue;
      }
      
      let tempTask = {userID: userID, subject: task, taskDate: datesArr[dayIdx], duration: taskTimes[task], assign: null, notes: null};
      allTasks.push(tempTask);
    }
  }
  console.log(allTasks);
  let counter = 0;
  let inc = () =>{counter++}
  while (counter < allTasks.length) {
    makeOne(allTasks[counter], inc());
  }
}

makeAll(days, _id);







