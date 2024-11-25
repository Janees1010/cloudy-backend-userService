
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {            
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function() {
       return !this.googleId
    }
},
  googleId:{
    type:String,
    sparse:true,
    unique:true
  },
  isGoogleAuth:{
    type:Boolean,
    default:false
  },
  role:{  
    type:String,
    default:"user" 
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;