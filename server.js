const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const publicPath = path.join(__dirname,'Porsche/Pages');
app.use(express.static(publicPath));

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, 'Porsche/Pages/Home.html'));
});
app.get('/:page', (req, res) => {
  const page = req.params.page;
  if(page)
    res.sendFile(path.join(__dirname, `Porsche/Pages/${page}.html`));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
