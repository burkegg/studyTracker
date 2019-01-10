const path = require('path');
const db = require(path.join(__dirname, 'index'));

const findById = function(id, cb) {
  console.log('------- insdie fin dById')
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
  console.log('INSIDE DB QUERY AT LEAST?!?!?!', params);
  db.query('select * from tasks where userID = ?', params, (err, data) => {
    if (err) {
      console.log('DB ERROR*****', err);
      throw err;
    } else {
      console.log('data inside query?');
      callback(data);
    }
  });
};

const postTaskByUser = function (params, callback) {
  console.log('inside postTaskByUser************');
  db.query('insert into tasks (userID, taskDate, duration, subject, assignment, notes) values (?, ?, ?, ?, ?, ?)', params, (err, data) => {
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


