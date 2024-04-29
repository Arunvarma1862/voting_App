const  mongoose= require('mongoose');
require('dotenv').config();

// const mongoURL= process.env.mongoDB_url_local 
const mongoURL= process.env.mongoDB_url_online

mongoose.connect(mongoURL)

const db= mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to mongoDB server')
})
db.on('error',(err)=>{
    console.log('MongoDB connection error',err)
})
db.on('disconnected',()=>{
    console.log('MongoDB disconnected')
})

module.exports=db