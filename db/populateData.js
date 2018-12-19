const path = require('path');
const db = require(path.join(__dirname, 'dbAPI'));
const mysql = require('mysql');

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
  {id: 22, date: '2018/12/10', duration: 25, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 23, date: '2018/12/11', duration: 15, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 24, date: '2018/12/11', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 25, date: '2018/12/12', duration: 20, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 26, date: '2018/12/12', duration: 15, subject: 'PE', assign: 'vocab worksheet', notes: 'bestwork'},
];


let writeDB = (data2) => {
  for (let i = 0; i < data2.length; i++) {
    let data = data2[i]
    let params = [data.date, data.duration, data.subject, data.assignment, data.notes, 3];
    db.postTaskByUser(params, function(resp) {
      console.log(resp);
    })
  }
}
writeDB(tasks);
 // (id, taskDate, duration, subject, assignment, notes, userID) 
