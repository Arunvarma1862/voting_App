const express= require('express');
const candidate= require('../models/candidate');
const User= require('../models/user');
const{jwtAuthMiddleware,generateToken}= require('../jwt')
const router= express.Router()


const checkAdmin=async (userId)=>{
    try{
        const user = await User.findById(userId);
        if(user.role === 'admin'){
            return true;
        }
   }catch(err){
        return false;
   }
}


router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!(await checkAdmin(req.user.id)))
        {
            return res.status(403).json({msg:"user is not admin"})
        }
        
     const data = req.body;
     const newCandidate= new candidate(data);
     const response=await newCandidate.save();
     console.log('data saved successfully',response);
     res.status(200).json({msg:"candidateAdded",response})
    }
    catch(err){
     console.log(err);
     res.status(500).json({msg:"internal server error"})
    }   
  })
 


 router.put('/:candidateId',jwtAuthMiddleware,async (req,res)=>{
   try{
    
    if(!(await checkAdmin(req.user.id))){
        return res.status(403).json({msg:"user is not admin"})
    }
     
    const candidateId= req.params.candidateId;
    const updatedCandidate=req.body;

    const response= await candidate.findByIdAndUpdate(candidateId,updatedCandidate,{
        new:true
    });

    if(!response){
        return res.status(404).json({msg:"candidate not found"})
    }
     console.log("candidate updated ");
     res.status(200).json(response)


    
   }
   catch(err){
      console.error(err);
      res.status(500).json({msg:"internal server error"})
   }
 })

 router.delete('/:candidateId',jwtAuthMiddleware,async (req,res)=>{
    try{
 
     if(!checkAdmin(req.user.id)){
         return res.status(403).json({msg:"user is not admin"})
     }
      
     const candidateId= req.params.candidateId;
     const response= await candidate.findByIdAndDelete(candidateId);
 
     if(!response){
         return res.status(404).json({msg:"candidate not found "})
     }
      console.log("candidate updated ");
      res.status(200).json({msg:"deleted"})
     
    }
    catch(err){
       console.error(err);
       res.status(500).json({msg:"internal server error"})
    }
  })
 

  // lets start voting

  router.post('/vote/:candidateId',jwtAuthMiddleware,async (req,res)=>{

    // no admin can vote
    // user can only vote once
    
    const  CandidateID = req.params.candidateId;
    console.log(CandidateID)
    const userId = req.user.id;

    try{
         // Find the Candidate document with the specified candidateID
    const Candidate= await candidate.findById(CandidateID);
    if(!Candidate){
        return res.status(400).json({msg:"candidate not found"})
    }
    const user = await User.findById(userId);
    if(!user){
        return res.status(400).json({msg:"user not found"})   
    }
    if(user.role == 'admin'){
        return res.status(403).json({ message: 'admin is not allowed to vote'});
    }
    if(user.isVoted){
        return res.status(200).json({ message: 'You have already voted' });  
    }
        // Update the Candidate document to record the vote
    Candidate.votes.push({user:userId});
    Candidate.voteCount++;
    await Candidate.save();

     // update the user document
     user.isVoted= true;
     await user.save();
     return res.status(200).json({ message: 'Vote recorded successfully' });

}
catch(err){
    console.log(err);
    return res.status(500).json({error: 'Internal Server Error'});
}

  })


  // voteCount 

  router.get('/vote/count',async (req,res)=>{
    try{
        // Find all candidates and sort them by voteCount in descending order
    const Candidate= await candidate.find().sort({voteCount:'desc'});

        // Map the candidates to only return their name and voteCount
      const voteRecord= Candidate.map((data)=>{
       return {
        partyName:data.party,
        count:data.voteCount
       }
    })
    res.status(200).json({response:voteRecord, msg:"Data"})
}
     catch(err){
    console.log(err);
    return res.status(500).json({error: 'Internal Server Error'});
}
  })
// Get List of all candidates with only name and party fields

router.get('/',async (req,res)=>{
    try{
          // Find all candidates and select only the name and party fields, excluding _id
           const Candidate= await candidate.find({},'name party _id');

          // Return the list of candidates
           res.status(200).json(Candidate)

    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
})


router.get('/partylist',async (req,res)=>{
    try{
        const Candidate= await candidate.find({},'party');
        console.log("Candidate",Candidate)
        res.status(200).json({party:Candidate,partyList:Candidate.length})
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:"internal server error"})
    }
    
})
 module.exports=router
 