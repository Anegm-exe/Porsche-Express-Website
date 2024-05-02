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

// Page Loaders
app.get('/', (req, res) => {
  res.redirect('/Home')
});

app.get('/:page', (req, res) => {
  const page = req.params.page;
  const filePath = path.join(__dirname, `Porsche/Pages/${page}.html`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('Page not found');
  }
});

// 

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
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