const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const session = require('express-session')
const dbConnection = require('./database') 
const passport = require('./passport');
const path = require('path');
const app = express();
const PORT = 8080;

const user = require('./routes/user');
const taskRouter = require('./routes/tasks');

app.use(morgan('dev'))
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, '../build')));
// app.get('/*', function(req, res) {
//   res.sendFile(path.join(__dirname, '../build', 'index.html'));
// })
app.use(
  session({
    secret: 'fraggle-rock', //pick a random string to make the hash that is generated secure
    resave: false, //required
    saveUninitialized: false //required
  })
)

app.get('/favicon.ico', (req, res) => res.status(204));

// Passport
app.use(passport.initialize())
app.use(passport.session()) // calls the deserializeUser

// app.use('/', (req, res, next) => {
//   console.log('session data', req.session);
//   next();
// })

// Routes
app.use('/user', user)

app.use('/api/tasks', taskRouter);

// Starting Server 
app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`)
})


