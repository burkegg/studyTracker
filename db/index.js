const mysql = require('mysql');

const sqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'tracker',
});

sqlConnection.connect();

module.exports = sqlConnection;