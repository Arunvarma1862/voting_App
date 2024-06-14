const  mongoose = require('mongoose');
require('dotenv').config();


// Define the MongoDB connection URL

const mongoURL= process.env.mongoDB_url_local    // Replace 'mydatabase' with your database name
// const mongoURL= process.env.mongoDB_url_online


// Set up MongoDB connection
mongoose.connect(mongoURL)

// Get the default connection
// Mongoose maintains a default connection object representing the MongoDB connection.

const db= mongoose.connection;


// Define event listeners for database connection
db.on('connected',()=>{
    console.log('Connected to mongoDB server')
})
db.on('error',(err)=>{
    console.log('MongoDB connection error',err)
})
db.on('disconnected',()=>{
    console.log('MongoDB disconnected')
})

// Export the database connection

module.exports=db