const mongoose: any = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type:String,
        required: false
    },
    age: {
        type: String,
        required: true
    },
    city: {
        type:String,
        required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });
  

  module.exports = mongoose.model("user", UserSchema);