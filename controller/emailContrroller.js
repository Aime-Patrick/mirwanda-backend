const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');


const sendEmail = asyncHandler(async(data, req,res) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          
          user: process.env.MAIL_ID,
          pass: process.env.Mp,
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Hey👻" <foo@gmail.com>', // sender address
          to: data.to, 
          subject: data.subject, 
          text: data.text, 
          html: data.html, 
        });
      
        console.log("Message sent: %s", info.messageId);
})
module.exports = {sendEmail}