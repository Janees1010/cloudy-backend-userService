// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  createUser,
  findUserByEmail,
  findUserById,
} = require("../services/userService");

const signup = async (req, res) => {
  console.log(req.body);
  
  const {
     username,
     email,  
     password 
    } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }
  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser)
  return res.status(400).json({ message: "User already exists." });
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await createUser(
      username,
      email,
      null,
      false, 
      hashedPassword
    );
    console.log(user + "            " + "user");
    
    const accessToken = jwt.sign(
      { userId: user._id },
       process.env.JWT_SECRET, {
       expiresIn: "15m",
    }
  );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const dataTosend = {
      _id:user._id,
      username,
      email,  
      token: accessToken,
      role: user.role,
    };
    res
      .status(201)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ message: "User created successfully.", user: dataTosend });
  } catch (error) {                                                          
    console.log(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const signin = async (req, res) => {
  const { 
    email, 
    password 
  } = req.body;
  console.log("signin");
  
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }
  // Find user
  let user = await findUserByEmail(email);

  if (user?.isGoogleAuth)
    return res.staus(500).json("Email already in use by Google sign-in.");
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  // Compare password
  const isMatch = await bcrypt.compare(
    password,
   user.password
  );

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials." });
  }
  // Generate token
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET, 
    { expiresIn: "15m",}
  );
  const refreshToken = jwt.sign(
    { userId: user._id }, 
    process.env.JWT_SECRET,
    { expiresIn: "7d",}
  );
  const dataTosend = {
    _id:user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token: accessToken,
  };

     
  res.cookie("refreshToken", refreshToken, {
    httpOnly:true,
    sameSite: "Lax", 
    secure: false, 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({ message: "Login successful.", user: dataTosend });
};

const generateToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;   
    if (req.user) {
      let { 
        username, 
        email, 
        role,
        _id
       } = req.user;

      const dataToSend = { 
        username, 
        email,
        role,
        _id
       };
      return res.status(200).json(dataToSend);
    }
    if (!refreshToken && !req.user)
      return res.status(401).json({ message: "refresh token expired" });

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET,
      async (err, decodedUser) => {
        if (err) return res.status(403).send("invalid Token");
        if (refreshToken) {
          const newToken = jwt.sign(
            { userId: decodedUser.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
          );
          const user = await findUserById(decodedUser.userId);
          if (user) {
            const dataToSend = {
              _id:user._id,
              username: user.username,
              email: user.email,
              token: newToken,
              role: user.role,
            };
            res.status(200).json(dataToSend);
          } else {
            throw "user details not found";
          }
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

const logout = (req, res) => {
  try {
    if (req.user) {
      req.logout();
      res.clearCookie("session", { path: "/" });
      res.clearCookie("session.sig", { path: "/" });
      return res.status(200).json({ message: "Logged out successfully." });
    } else {
      res.clearCookie("refreshToken", { path: "/" });      
      return res.status(200).json({ message: "Logged out successfully." });
    }
  } catch (error) {
    return res.status(500).json("error during logout");
  }
};

module.exports = {
   signup,
   signin,
   generateToken,
   logout
 };
