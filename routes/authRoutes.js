const express = require("express")
const router = express.Router()
const {googleAuth,googleCallback} = require("../controller/authController")
const passport = require("passport")

 
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login/failed', 
  }),googleCallback); 
  
router.get("/google",googleAuth)  
  
 
  
module.exports = router