const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Express App

const app = express();
const PORT = process.env.PORT || 3000;

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