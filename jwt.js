const jwt= require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware=(req,res,next)=>{

    const Token= req.headers.authorization;
    console.log("To",Token)
    if(!Token) return res.status(401).json({msg:"Token Not found"});

    const token = req.headers.authorization.split(' ')[1];
    console.log("Tok",token)
    if(!token)  return res.status(401).json({msg:"unauthrozied"});

    try{
        const decoded= jwt.verify(token,process.env.JWT_SECRET);
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
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:30000})
}

module.exports={
jwtAuthMiddleware,generateToken
}
