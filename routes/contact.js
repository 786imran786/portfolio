const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Create a transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Contact form endpoint
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid email address' 
      });
    }

    // Check if email credentials are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not set. Logging message instead of sending email:');
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Message:', message);
      
      return res.json({ 
        success: true, 
        message: 'Message logged successfully! (Email not configured)' 
      });
    }

    // Send actual email
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New message from ${name} - Portfolio Contact Form`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Sent from your portfolio contact form</em></p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', process.env.CONTACT_EMAIL || process.env.EMAIL_USER);

    res.json({ 
      success: true, 
      message: 'Message sent successfully! I\'ll get back to you soon.' 
    });
    
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

module.exports = router;