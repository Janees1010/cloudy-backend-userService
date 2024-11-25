const express = require("express")
const router  = express.Router()
const {signup,signin,generateToken,logout} = require("../controller/userController")

router.post("/signin",signin)
router.post("/signup",signup)
router.get("/refreshtoken",generateToken)
router.get("/logout",logout)
router.get("/login/failed",(req,res)=>{
   return res.status(500).json("google auth failed")
})

module.exports = router     