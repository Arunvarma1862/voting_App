const jwt= require('jsonwebtoken');
require('dotenv').config();
const secret='12345'

const jwtAuthMiddleware=(req,res,next)=>{
   


    const Token= req.headers.authorization;
    console.log("To",Token)
    if(!Token) return res.status(401).json({msg:"Token Not found"});

    const token = req.headers.authorization.split(' ')[1];
    console.log("Tok",token)
    if(!token)  return res.status(401).json({msg:"un-authrozied"});

    try{
        // process.env.JWT_SECRET
        const decoded= jwt.verify(token,secret);
        console.log("dec",decoded)
        req.user= decoded;
        next()
    }
    catch(err){

        console.error(err);
        res.status(401).json({msg:"invalid Token"})

    }
}



const generateToken= (userData)=>{
    return jwt.sign(userData,secret,{expiresIn:30000})
}

module.exports={
jwtAuthMiddleware,generateToken
}
