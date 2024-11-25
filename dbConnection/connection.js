const mongoose = require('mongoose');


const connectDb = async()=>{
  try{    
       await  mongoose.connect( "mongodb+srv://janeesleo55:janees5510@blog.aya6be9.mongodb.net/cloudy?retryWrites=true&w=majority&appName=Blog" )
       console.log("mongoDB Connected");
  }catch(error){
    if (error instanceof AggregateError) {
      console.log('Errors array:', error.errors); // Should show aggregated errors
      console.log('Cause:', error.cause); // Check if cause contains useful info
    } else {
      console.error(error);
    }
  } 
}

 
module.exports = connectDb; 