const express= require('express')
const db = require('./db');
const bodyParser= require('body-parser')
require('dotenv').config();
const PORT = process.env.PORT || 3000;


const app= express()



// middleware

app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}));

// Routes

const userRoute= require('./routes/user');
const candidateRoute= require('./routes/candidate');

app.use('/user',userRoute)
app.use('/candidate',candidateRoute)



//server


app.listen(PORT,()=>{console.log(`server started at port ${PORT}`)})