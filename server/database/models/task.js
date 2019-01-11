const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.promise = Promise


// Define userSchema
const taskSchema = new Schema({
  userID: { type: String, unique: false, required: true},
  taskDate: { type: Date, unique: false, required: true},
  duration: { type: Number, unique: false, required: true},
  subject: { type: String, unique: false, required: true},
  assign: { type: String, unique: false, required: false},
  notes: { type: String, unique: false, required: false}
})


const Task = mongoose.model('Task', taskSchema)
module.exports = Task
