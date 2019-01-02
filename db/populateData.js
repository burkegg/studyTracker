const path = require('path');
const db = require(path.join(__dirname, 'dbAPI'));
const mysql = require('mysql');

let tasks = [
  {id: 1, userID: '5c23b8cf8a615919c151786d', date: '2018/11/25', duration: 30, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 2, userID: '5c23b8cf8a615919c151786d', date: '2018/11/27', duration: 35, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 3, userID: '5c23b8cf8a615919c151786d', date: '2018/11/28', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 4, userID: '5c23b8cf8a615919c151786d', date: '2018/11/29', duration: 15, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 5, userID: '5c23b8cf8a615919c151786d', date: '2018/11/29', duration: 30, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 6, userID: '5c23b8cf8a615919c151786d', date: '2018/11/29', duration: 40, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 7, userID: '5c23b8cf8a615919c151786d', date: '2018/12/1', duration: 60, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 8, userID: '5c23b8cf8a615919c151786d', date: '2018/12/2', duration: 50, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 9, userID: '5c23b8cf8a615919c151786d', date: '2018/12/3', duration: 20, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 10, userID: '5c23b8cf8a615919c151786d', date: '2018/12/5', duration: 25, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 11, userID: '5c23b8cf8a615919c151786d', date: '2018/12/6', duration: 10, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 12, userID: '5c23b8cf8a615919c151786d', date: '2018/12/6', duration: 55, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 13, userID: '5c23b8cf8a615919c151786d', date: '2018/12/7', duration: 5, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 14, userID: '5c23b8cf8a615919c151786d', date: '2018/12/7', duration: 20, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 15, userID: '5c23b8cf8a615919c151786d', date: '2018/12/7', duration: 10, subject: 'History', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 16, userID: '5c23b8cf8a615919c151786d', date: '2018/12/7', duration: 80, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 17, userID: '5c23b8cf8a615919c151786d', date: '2018/12/8', duration: 25, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 18, userID: '5c23b8cf8a615919c151786d', date: '2018/12/8', duration: 15, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 19, userID: '5c23b8cf8a615919c151786d', date: '2018/12/8', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 20, userID: '5c23b8cf8a615919c151786d', date: '2018/12/8', duration: 20, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 21, userID: '5c23b8cf8a615919c151786d', date: '2018/12/9', duration: 15, subject: 'PE', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 22, userID: '5c23b8cf8a615919c151786d', date: '2018/12/10', duration: 25, subject: 'French', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 23, userID: '5c23b8cf8a615919c151786d', date: '2018/12/11', duration: 15, subject: 'English', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 24, userID: '5c23b8cf8a615919c151786d', date: '2018/12/11', duration: 25, subject: 'Math', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 25, userID: '5c23b8cf8a615919c151786d', date: '2018/12/12', duration: 20, subject: 'Science', assign: 'vocab worksheet', notes: 'bestwork'},
  {id: 26, userID: '5c23b8cf8a615919c151786d', date: '2018/12/12', duration: 15, subject: 'PE', assign: 'vocab worksheet', notes: 'bestwork'},
];


let writeDB = (data2) => {
  for (let i = 0; i < data2.length; i++) {
    let data = data2[i]
    let params = [data.date, data.duration, data.subject, data.assignment, data.notes, data.userID];
    db.postTaskByUser(params, function(resp) {
      console.log(resp);
    })
  }
}
writeDB(tasks);
 // (id, taskDate, duration, subject, assignment, notes, userID) 
