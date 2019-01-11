const express = require('express')
const router = express.Router()
const User = require('../database/models/user')
const passport = require('../passport')
const testSafety = require('../util/safety');

router.post('/', (req, res) => {
  const { username, password } = req.body

  let checkData = [username, password];
  if (!testSafety(checkData)) {
    res.send('failed safety check');
    return;
  }
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      res.json({
        errmsg: 'Error looking up a user in the user database'
      })
    } else if (user) {
      res.json({
          errmsg: `The name ${username} is taken.`
      })
    }
    else {
      const newUser = new User({
          username: username,
          password: password
      })
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
    var userInfo = {
        username: req.user.username
    };
    res.send(userInfo);
  }
)

router.get('/', (req, res, next) => {
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