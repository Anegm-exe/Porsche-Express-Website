const express = require('express');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { cookieJwtAuth } = require('./Porsche/Pages/Middleware/cookieJwtAuth');
require('dotenv').config();

// Express App
const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

// MongoDB connection
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();

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

// Signin
const SignUpRoute = require('./Porsche/Pages/Routes/SignUp');
app.post('/SignUp', SignUpRoute);

// Login 
const loginRoute = require('./Porsche/Pages/Routes/login');
app.post('/SignIn', loginRoute);

// EXAMPLE FOR MIDDLEWARE
// app.get('/Collection',cookieJwtAuth,(req,res) => {
    
// });

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});