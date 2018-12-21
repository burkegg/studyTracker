const path = require('path');
const db = require(path.join(__dirname, 'index'));

let records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [ { value: 'jack@example.com' } ] }
  , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [ { value: 'jill@example.com' } ] }
];

const findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}

const findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}


const getTasksByUser = function (params, callback) {
  db.query('select * from tasks where userID = ?', params, (err, data) => {
    if (err) {
      throw err;
    } else {
      callback(data);
    }
  });
};

const postTaskByUser = function (params, callback) {
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

module.exports = { getTasksByUser, postTaskByUser, findByUsername, findById };


