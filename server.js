const express = require('express');
const cors = require('cors');
const app = express();
const nodemailer = require('nodemailer');
const session = require('express-session');
const {MongoStore} = require('connect-mongo');
require('dotenv').config();
const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Allow requests from frontend
app.use(cors({
  origin: 'http://localhost:5173', // React app origin
 credentials: true 
}));

app.use(express.json())

app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/sessionDB',
    collectionName: 'sessions',
    ttl: 60 * 60 * 1000,
  }),
  cookie:{
    maxAge: 60 * 60 *1000,
    httpOnly: true,
    sameSite: 'lax'
  }
}));


app.get('/api/data', (req, res) => {
  res.json({ message: 'This is Express Backend message' });
});

app.get('/', (req, res) => {
  res.send("Backend is Running");
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'macktech28@gmail.com',
    pass: 'kcwmqkdjbyryonbt'
  }
})


app.post('/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;
   req.session.userEmail = email;
   console.log(req.session.userEmail);
  try {
    await transporter.sendMail({
      from: email,
      to: 'macktech28@gmail.com',
      subject: `${name} Sent You a Message`,
      text: `The User name is ${name} And the message from user is ${message} and here is the user phone number: ${phone}`
    })
    await transporter.sendMail({
      from: 'macktech28@gmail.com',
      to: email,
      subject: `Request Recieved`,
      text: `Mr ${name}, Your Request has been recieved. I will contact you shortly`
    })
  } catch (err) {
    res.status(500).json({success: false, message: `Email not sent due to: ${err}`})
  }
})


app.listen(5000, () => {
  console.log('Backend server running on http://localhost:5000');
});
