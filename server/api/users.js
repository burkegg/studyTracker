const userRouter = require('express').Router();

let userId = 0;

let users = [];

userRouter.get('/', (req, res) => {
  console.log('getting user info');
  res.send(req.body);
})