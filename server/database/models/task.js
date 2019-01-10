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

// Define schema methods
// userSchema.methods = {
//   checkPassword: function (inputPassword) {
//     return bcrypt.compareSync(inputPassword, this.password)
//   },
//   hashPassword: function (plainTextPassword) {
//     return bcrypt.hashSync(plainTextPassword, 10)
//   },
// }. 

// Define hooks for pre-saving
// userSchema.pre('save', function (next) {
//   if (!this.password) {
//     console.log('models/user.js =======NO PASSWORD PROVIDED=======')
//     next()
//   } else {
//     console.log('models/user.js hashPassword in pre save');
//     this.password = this.hashPassword(this.password)
//     next()
//   }
// })

const Task = mongoose.model('Task', taskSchema)
module.exports = Task
