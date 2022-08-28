import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { stringToHash,varifyHash,validateHash} from "bcrypt-inzi"
const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 3000

const userSchema = new mongoose.Schema({
    fname: {type : String},
    lname: {type : String},
    email: {type : String , required : true},
    password: {type : String, required : true},
    createdOn : {type : Date , default : Date.now}
  });


const userModel = mongoose.model('User', userSchema);



app.post('/signup', (req, res) => {
  
  let body = req.body

  if(!body.fname || !body.lname || !body.email || !body.password){
    res.status(401).send(`Please Fill all Required Fields 
    
       {
        fname : "john",
        lname : "doe",
        email : "john@abc.com",
        password : "1234"
       }
     `)
     return;
  }

  userModel.findOne({email : body.email}, (err,data) => {

       if(!err){
  
         if(data){
            res.status(401).send({message : "User already Exist"})
            return;
         }else{
            stringToHash(body.password).then(hashString => {

                let newUser = new userModel({
                    
                     fname : body.fname,
                     lname : body.lname,
                     email : body.email.toLowerCase(),
                     fname : hashString

                   })
                   newUser.save((err,result) => {

                     if(!err){
                        console.log("Data Saved " , result);
                        res.status(201).send({message : "User is Created"})
                     }else{
                        console.log("db error " , err);
                        res.status(500).send({message : "Internal Server Error"})
                     }

                   })
            })
         }
          
          
       }else{
          console.log("db error", err);
          res.status(500).send({message : "db error in query"})
          return
       }
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

let dbURI = "mongodb+srv://abc:abc@cluster0.om4pvlj.mongodb.net/socialMediaBase?retryWrites=true&w=majority";
// let dbURI = 'mongodb://localhost/mydatabase';
mongoose.connect(dbURI);


////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
    // process.exit(1);
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////