const mongoose = require('mongoose');
const bcrypt= require('bcrypt')

const userSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        
    },
    mobile:{
        type:String,

    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default: false
    }
},{timestamps:true})


userSchema.pre('save',async function(next){
    const user=this;
    console.log('hello1366')
    if(!user.isModified('password')){
        console.log('hello')
        return next()
    }
    try{
        console.log('1236445685')
        const salt= await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password,salt)
        user.password= hashedPassword
        next()
    }
    catch(err){

        return next(err)

    }
})


userSchema.methods.comparePassword= async function(candidatePassword){
    try{
         console.log(this.password, candidatePassword)
          const isMatch = await bcrypt.compare(candidatePassword,this.password);
          return isMatch;
    }
    catch(err){
        throw err
    }
}


const user = mongoose.model('user',userSchema);

module.exports=user