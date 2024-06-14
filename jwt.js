const jwt= require('jsonwebtoken');
require('dotenv').config();
const secret='12345'


const jwtAuthMiddleware=(req,res,next)=>{

    // first check request headers has authorization or not
    const Token= req.headers.authorization;
    console.log("To",Token)
    if(!Token) return res.status(401).json({msg:"Token Not found"});


     // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    console.log("Tok",token)
    if(!token)  return res.status(401).json({msg:"un-authrozied"});

    try{
         // Verify the JWT token
        const decoded= jwt.verify(token,secret);  // process.env.JWT_SECRET
        console.log("dec",decoded)
        req.user= decoded;
        next()
    }
    catch(err){

        console.error(err);
        res.status(401).json({msg:"invalid Token"})

    }
}
// Function to generate JWT token
const generateToken= (userData)=>{
     // Generate a new JWT token using user data
    return jwt.sign(userData,secret,{expiresIn:30000})
}

module.exports={
jwtAuthMiddleware,generateToken
}
