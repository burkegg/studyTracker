const taskRouter = require('express').Router();

let users = [];
let userId = 0;
let taskId = 0;

let tasks = [
  {id: 1, date: '2018/11/25', duration: 30, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 2, date: '2018/11/27', duration: 35, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 3, date: '2018/11/28', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 4, date: '2018/11/29', duration: 15, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 5, date: '2018/11/29', duration: 30, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 6, date: '2018/11/29', duration: 40, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 7, date: '2018/12/1', duration: 60, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 8, date: '2018/12/2', duration: 50, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 9, date: '2018/12/3', duration: 20, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 10, date: '2018/12/5', duration: 25, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 11, date: '2018/12/6', duration: 10, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 12, date: '2018/12/6', duration: 55, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 13, date: '2018/12/7', duration: 5, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 14, date: '2018/12/7', duration: 20, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 15, date: '2018/12/7', duration: 10, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 16, date: '2018/12/7', duration: 80, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 17, date: '2018/12/8', duration: 25, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 18, date: '2018/12/8', duration: 15, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 19, date: '2018/12/8', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 20, date: '2018/12/8', duration: 20, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 21, date: '2018/12/9', duration: 15, subject: 'PE', assign: 'vocab worksheet', notes: 'bestwork'},
];


// let updateTaskId = (req, res, next) => {
//   if (!req.body.id) {
//     taskId++;
//     req.body.taskId = taskId + '';
//   }
//   next();
// }

// Route path: /flights/:from-:to
taskRouter.get('/', (req, res) => {
  let userID = req.params.userID;
  let endDate = req.params.endDate;
  console.log('inside get request', tasks);
  let reply = {id: 22, date: '2018/12/14', duration: 15, subject: 'PE', assign: 'vocab worksheet', notes: 'bestwork'};
  res.send(JSON.stringify(tasks));
}); 

// post a task to an existing user
taskRouter.post('/', (req, res) => {
  // put me back!   api/newTask/user/:userID/
  const userID = req.body.userID;
  const date = req.body.date;
  const duration = req.body.duration;
  const subject = req.body.subject;
  const assign = req.body.assign;
  const notes = req.body.notes;
  console.log(userID, date, duration, subject, assign, notes);
  console.log('request body', req.body);
  res.sendStatus(404);
})

module.exports = taskRouter;