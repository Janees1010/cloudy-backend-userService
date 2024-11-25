
const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const cors = require("cors")
const DB  = require("./dbConnection/connection")
const passport = require("passport")  
const GoogleStrategy = require("passport-google-oauth20").Strategy
const cookieSession = require("cookie-session")
const authRoutes = require("./routes/authRoutes") 
const cookieParser = require("cookie-parser")
const {createUser,findUserByEmail}  = require("./services/userService")
require("dotenv").config()

 
app.use(cors({
    origin: process.env.CLIENT, 
    credentials: true   
  }));


  app.use(cookieParser())   
 

app.use(cookieSession({name:"session",maxAge:7 * 24 * 60 * 60 * 1000,keys:["secret123456jkhhjgbhvjh"],secure:false}))
 

app.use(express.urlencoded({ extended: true })); 
app.use(express.json())


app.use(passport.initialize());
app.use(passport.session())

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,  
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback", 
    scope:["profile","email"],                           
  },async function (accsessToken,refreshToken,profile,done){
      try{
         const existingUser = await findUserByEmail(profile._json.email)
         if(existingUser) return done(null, existingUser);
         const newUser  = await createUser(profile.displayName,profile._json.email,profile.id,true)
         done(null,newUser)
      }catch(err){
        return done(err)
      }
  }   
  ));

  
  passport.serializeUser((user, done) => {  
    done(null, user);
  });
  passport.deserializeUser((user, done) => {   
    done(null, user);  
  });  
     
  app.use('/',userRoutes);    
  app.use("/auth",authRoutes)    
  
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port :${process.env.PORT}`);
  });   
  DB()                                          