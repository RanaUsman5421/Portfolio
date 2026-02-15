const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require('path');



// Allow requests from frontend
app.use(cors());

app.use(express.json())


app.get('/api/data', (req, res) => {
  res.json({ message: 'This is Express Backend message' });
});


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})


app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;
   
  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `${name} Sent You a Message`,
      text: `The User name is ${name} And the message from user is ${message} and here is the user phone number: ${phone}`
    })
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Request Recieved`,
      text: `Mr ${name}, Your Request has been recieved. I will contact you shortly`
    })
    res.status.json({success: true})
  } catch (err) {
    res.status(500).json({success: false, message: `Email not sent due to: ${err}`})
  }
})

app.use(express.static(path.join(__dirname, 'build')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});