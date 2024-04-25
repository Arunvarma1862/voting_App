const express= require('express');
const user= require('../models/user');
const{jwtAuthMiddleware,generateToken}= require('../jwt')
const router= express.Router()


 router.post('/signup',async(req,res)=>{
      try{
           const data = req.body;  // Assuming the request body contains the User data

          // Check if there is already an admin user
     const adminUser = await user.findOne({ role: 'admin' });
     if (data.role === 'admin' && adminUser) {
         return res.status(400).json({ error: 'Admin user already exists' });
     }

     // Validate Aadhar Card Number must have exactly 12 digits
       if (!/^\d{12}$/.test(data.aadharCardNumber)) {
               return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
       }

         // Check if a user with the same Aadhar Card Number already exists
         const existingUser = await user.findOne({ aadharCardNumber: data.aadharCardNumber });
         if (existingUser) {
             return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
         }
 
          // Create a new User document using the Mongoose model
        const newUser= new user(data);

     // Save the new user to the database
      const response=await newUser.save();
      console.log('data saved successfully',response);
      const payload={
      id:response.id,
    }
       console.log(JSON.stringify(payload))
       const token = generateToken(payload);
       console.log('Token :', token)
       res.status(201).json({response:response,Token:token})
   }
   catch(err){
       console.log(err);
       res.status(500).json({msg:"internal server error"})
   }   
 })


 // login

 router.post('/login',async (req,res)=>{
   try{
       // Extract aadharCardNumber and password from request body
   const{aadharCardNumber,password}= req.body;
   console.log("md",aadharCardNumber, password)

    // Check if aadharCardNumber or password is missing
    if (!aadharCardNumber || !password) {
      return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
      }
   // Find the user by aadharCardNumber
   const User= await user.findOne({aadharCardNumber:aadharCardNumber});
   console.log(User);
   // If user does not exist or password does not match, return error
   if(!User || !(await User.comparePassword(password))){
      return res.status(401).json({error:'invalid username and password'})
   }

   const payload={
      id:User.id,
   }
     // generate Token 
   const token = generateToken(payload);

     // return token as response
   res.json({token})
}
catch(err){
   console.error(err);
   res.status(500).json({msg:"internal server error"})
}
 });

 // profile

 router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
   try{
   // const userData= req.user;
   // console.log('UserData:',userData);
   // const userID= userData.id;
   
   const User= await user.findById(req.user.id);
   res.status(200).json({User})
   }
   catch(err){
      console.error(err);
      res.status(500).json({msg:"internal server error"})
   }
 })

 router.put('/profile/password/',jwtAuthMiddleware,async (req,res)=>{
   try{
     
      const userID= req.user   // Extract the id from the token
      console.log("user_id",userID.id)  
      const {currentPassword,newPassword}= req.body  // Extract current and new passwords from request body

       // Check if currentPassword and newPassword are present in the request body
       if (!currentPassword || !newPassword) {
         return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
     }

      // Find the user by userID

      const User= await user.findById({_id:userID.id});

     // If user does not exist or password does not match, return error
      if(!User || !(await User.comparePassword(currentPassword))){
         return res.status(401).json({error:'invalid  password'})
      }

       // Update the user's password
      User.password= newPassword;
      await User.save();
      console.log('password changed')
      res.status(200).json({msg:"password Changed", response: User})
    
   }
   catch(err){
      console.error(err);
      res.status(500).json({msg:"internal server error"})
   }
 })



 module.exports=router
 