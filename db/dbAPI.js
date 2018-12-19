const path = require('path');
const db = require(path.join(__dirname, 'index'));

const getTasksByUser = function getTasksByUser (params, callback) {
  db.query('select * from tasks where userID = ?', params, (err, data) => {
    if (err) {
      throw err;
    } else {
      callback(data);
    }
  });
};

const postTaskByUser = function postTaskByUser (params, callback) {
  db.query('insert into tasks (taskDate, duration, subject, assignment, notes, userID) values (?, ?, ?, ?, ?, ?)', params, (err, data) => {
    if (err) {
      throw err;
    } else {
      callback()
    }
  })
}

const createUser = function createUser (params, callbak) {
  db.query('insert into users (name) values (?)', params, (err, data) => {
    if (err) {
      throw err;
    } else {
      callback()
    }
  })
}

module.exports = { getTasksByUser, postTaskByUser };