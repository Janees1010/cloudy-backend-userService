const passport  = require("passport")

 const googleCallback = (req, res) => {
    res.redirect(process.env.CLIENT || 'http://localhost:3000'); 
  };

  const googleAuth = passport.authenticate("google", ["profile", "email"]);

            
  module.exports = {googleAuth,googleCallback}
               