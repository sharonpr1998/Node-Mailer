import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import User from "./models/User.js"
import sendOTPEmail from "./utils/sendEmail.js"


const app = express()

const PORT = 5000

app.use(express.json())

//Mongo connection
mongoose.connect(process.env.MONGO_URI).then(()=>{
  console.log("MongoDb connected")
}).catch((error)=>{
  console.log(error)
})


app.post("/register",async (req,res)=>{
   try {
    const {name,email,password} = req.body;

    const existingUser = await User.findOne({email});

    if(existingUser){
      return res.status(400).json({message:"user alreday exisit"})
    }

    const otp = Math.floor(100000 + Math.random()*999999).toString()

    const otpExpires = new Date(Date.now()+ 5 *60*1000)

    const user = await User.create({
      name,
      email,
      password,
      otp,
      otpExpires,
      isVerifed:false
    })

    sendOTPEmail(email,otp);

    res.status(201).json({message:"Registration Successfull.OTP sent to your email"})
   } catch (error) {
    console.log(error)

    res.status(500).json({message:"Server Error"})
   }
})



app.post("/verify-otp",async(req,res)=>{
  try {

    const {email,otp} = req.body;

    const user = await User.findOne({email})

    if(!user){
      return res.status(404).json({message:"user not found"})
    }

    if(user.otp !== otp){
      return res.status(400).json({message:"Invalid OTP"})
    }

    if(user.otpExpires < new Date()){
      return res.status(400).json({message:"OTP expires"})
    }


    user.isVerifed = true;

    user.otp = undefined;
    user.otpExpires = undefined;


    await user.save()

    res.status(200).json({message:"Email verified successfully"})
    
  } catch (error) {
  console.log(error)
  res.status(500).json({message:"Server Error"})
  }
})


app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`)
})