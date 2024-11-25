const User = require("../models/user")


const createUser = async(
  username,
  email,
  googleId,
  isGoogleAuth,
  password
) => {
   const newUser = new User({
     username,
     email,
     googleId: isGoogleAuth ? googleId : null,
     isGoogleAuth
   })
    if(!isGoogleAuth)newUser.password = password
    const response  = await newUser.save()
    return response
}

const findUserByEmail = async(email) =>{
     const response  = await User.findOne({email})
     if (!response) {
      console.log("User not found");
    }
    return response;
}

const findUserById = async(id)=>{             
  const user = await  User.findById(id)
  if(user){  
    return user
  }
}
 

module.exports = {
  createUser,
  findUserByEmail,
  findUserById
}