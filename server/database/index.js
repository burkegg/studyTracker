//Connect to Mongo database
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

//your local database url
//27017 is the default mongoDB port
const uri = 'mongodb://ec2-54-183-224-183.us-west-1.compute.amazonaws.com:27017/graphmytime' 

mongoose.connect(uri, 
  {
    user: 'root',
    pass: 'pass'
  }).then(
  () => { 
    console.log('Connected to Mongo');
      
  },
  err => {
    console.log('error connecting to Mongo: Did you remember to put in the password?')
    console.log(err);  
  }
);


module.exports = mongoose.connection;
  