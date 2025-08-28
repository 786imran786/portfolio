require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '*** set ***' : 'NOT SET');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('Email credentials not found in environment variables');
  process.exit(1);
}

// Create transporter with the correct method name
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error with email configuration:', error);
  } else {
    console.log('Server is ready to take our messages');
    
    // Now send test email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'Test Email from Portfolio',
      text: 'This is a test email from your portfolio application.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending test email:', error);
      } else {
        console.log('Test email sent successfully:', info.response);
      }
    });
  }
});