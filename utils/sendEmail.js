import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user:process.env.EMAIL_USER,
    pass:process.env.EMAIL_PASS
  }
})

const sendOTPEmail = async (email,otp)=>{
  await transporter.sendMail({
    from:process.env.EMAIL_USER,
    to:email,
    subject:"Your OTP verification code",
    html:`
    <div style="font-family:Arial; padding:20px;">
    <h2>Email verification</h2>
    <p>Your OTP is:</p>
    <h1>${otp}</h1>
    <p>This otp will expire in 5 minitues</p>
    </div>
    `
  })
}

export default sendOTPEmail;