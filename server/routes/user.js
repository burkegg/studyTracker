const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')
const testSafety = require('../util/safety');

router.post('/', (req, res) => {
  console.log('user signup');

  const { username, password } = req.body

  let checkData = [username, password];
  // console.log('safety dance safety dance safety dance');
  // console.log(testSafety(checkData));
  if (!testSafety(checkData)) {
    res.send('failed safety check');
    return;
  }
  console.log('username', username, 'pass:', password);
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      console.log('User.js post error: ', err)
    } else if (user) {
      console.log('user already found')
      res.json({
          errmsg: `The name ${username} is taken.`
      })
    }
    else {
      console.log('user not found trying to save');
      const newUser = new User({
          username: username,
          password: password
      })
      console.log('NEW USER MADE', newUser);
      newUser.save((err, savedUser) => {
          if (err) return res.json(err)
          res.json(savedUser)
      })
    }
  })
})

router.post( '/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  (req, res) => {
    console.log('logged in', req.user);
    var userInfo = {
        username: req.user.username
    };
    res.send(userInfo);
  }
)

router.get('/', (req, res, next) => {
  console.log('===== user!!======')
  if (req.user) {
      res.json({ user: req.user })
  } else {
      res.json({ user: null })
  }
})

router.post('/logout', (req, res) => {
  if (req.user) {
    req.logout()
    res.send({ msg: 'logging out' })
  } else {
    res.send({ msg: 'no user to log out' })
  }
})

module.exports = router