const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Express App

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY || '3kWn7$!l#X@3l7cF';


const publicPath = path.join(__dirname,'Porsche/Pages');
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

// Page Loaders
app.get('/', (req, res) => {
  res.redirect('/Home')
});

app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, `Porsche/Pages/${page}.html`);

    if (fs.existsSync(filePath))
        res.status(200).sendFile(filePath);
    else
        res.status(404).send('Page not found');
});

app.post('/SignUp', async (req, res) => {
    const { Fname, Lname, email, password, confirmPassword, dob } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const db = client.db('porsche');
    const usersCollection = db.collection('Customer');

    // Create new user
    const newUser = {
        First_name: Fname,
        Last_name: Lname,
        email: email,
        password: password, // TODO: hash passwords
        dob: dob
    };

    try {
        // Insert the new user into the database
        const result = await usersCollection.insertOne(newUser);
        console.log(`New user created with the following id: ${result.insertedId}`);
        res.status(201).send('User created');
    } catch (err) {
        console.error('Error occurred while creating user:', err);
        if (err.code === 11000) {
            res.status(409).send('Email already exists');
        } else {
            res.status(500).send('An error occurred');
        }
    }
});

app.post('/SignIn', async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  const db = client.db('porsche');
  const customerCollection = db.collection('Customer');
  const adminCollection = db.collection('Admin');

  try {
      // Check in Customer table
      let user = await customerCollection.findOne({ email: email });
      if (!user) {
          // If not found in Customer table, check in Admin table
          user = await adminCollection.findOne({ email: email });
      }

      if (!user) {
          return res.status(404).send('User not found');
      }
      if (password != user.password) {
          return res.status(403).send('Invalid password');
      }
      // If the password is correct, generate a JWT for the user
      // Include the user's role in the JWT payload
      const token = jwt.sign({ _id: user._id, role: user.role }, secretKey);

      // Send the token to the client
      res.status(200).json({ token: token });
  } catch (err) {
      console.error('Error occurred while signing in:', err);
      res.status(500).send('An error occurred');
  }
});
// JWT verification middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      res.redirect('/home');
      next();
  });
}

// MongoDB connection
const { MongoClient } = require('mongodb');

const mongoURI = 'mongodb+srv://porschteez:d7NzmIIfk7Nkj8fY@cluster0.aoy9mn2.mongodb.net/';

const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        // You can add more MongoDB operations here.
    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    }
}

run().catch(console.dir);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});