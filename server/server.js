const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const dbConnection = require('./database') 

const passport = require('./passport');
const app = express()
const PORT = 8080
// Route requires
const user = require('./routes/user')
const tasks = require('./routes/tasks');

// MIDDLEWARE
app.use(morgan('dev'))
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())

// Sessions
app.use(
  session({
    secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
    resave: false, //required
    saveUninitialized: false //required
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser

app.use('/', (req, res, next) => {
  // console.log('session data', req.session);
  next();
})

// Routes
app.use('/user', user)

app.use('/api/tasks', tasks);



// Starting Server 
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`)
})





// const config = require('./config/config');
// const express = require('express');
// const path = require('path');
// const bodyParser = require('body-parser');
// const _ = require('lodash');
// const logger = require('./util/logger');
// const taskRouter = require('./api/tasks');
// const userRouter = require('./api/tasks');
// const passport = require('passport');
// const Strategy = require('passport-local').Strategy;
// const db = require('../db');



// // Configure the local strategy for use by Passport.
// //
// // The local strategy require a `verify` function which receives the credentials
// // (`username` and `password`) submitted by the user.  The function must verify
// // that the password is correct and then invoke `cb` with a user object, which
// // will be set at `req.user` in route handlers after authentication.
// passport.use(new Strategy(
//   function(username, password, cb) {
//     db.users.findByUsername(username, function(err, user) {
//       if (err) { return cb(err); }
//       if (!user) { return cb(null, false); }
//       if (user.password != password) { return cb(null, false); }
//       return cb(null, user);
//     });
//   }));



// // Configure Passport authenticated session persistence.
// //
// // In order to restore authentication state across HTTP requests, Passport needs
// // to serialize users into and deserialize users out of the session.  The
// // typical implementation of this is as simple as supplying the user ID when
// // serializing, and querying the user record by ID from the database when
// // deserializing.
// passport.serializeUser(function(user, cb) {
//   cb(null, user.id);
// });

// passport.deserializeUser(function(id, cb) {
//   db.users.findById(id, function (err, user) {
//     if (err) { return cb(err); }
//     cb(null, user);
//   });
// });

// const app = express();
// const port = config.port;
// require('./middleware/middleware')(app);

// app.post('/', (req, res, next) => {
//   console.log('server post name: ', req.body.username);
//   res.end();
// })
// app.use('/', express.static(path.join(__dirname, '../build')));



// app.use('/api/tasks', taskRouter);



// app.post('/api/users/', (req, res) => {
//   const userName = req.body.userName;
//   console.log('userName submitted: ', userName);
// })

// app.delete('/api/tasks/:taskID', (req, res) => {
//   const id = req.params.taskID;
//   console.log('we are deleting: ', id);
// })

// // app.use('/*', express.static(path.join(__dirname, '../build')));
// app.listen(port, () => {
//   console.log(`server running at ${port}`);
// });

// app.use(function(err, req, res, next) {
//   if (err) {
//     console.log(err.message);
//     res.status(500).send(err);
//   }
// })

// module.exports = {
//   app,
// };
