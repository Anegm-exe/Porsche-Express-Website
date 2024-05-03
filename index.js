const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const { cookieJwtAuth } = require('./Porsche/Pages/Middleware/cookieJwtAuth');
require('dotenv').config();

// Express App
const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 3000;

// MongoDB connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const db = client.db('porsche');

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

// Get all cars
app.get('/Collection/api/v1/cars',(req,res)=>{
  let cars = [];
  db.collection('Product')
    .find()
    .forEach(car => cars.push(car))
    .then(()=>{
      res.status(200).json(cars);
    }).catch((err)=>{
      res.status(500).json({error:"Error in fetching data"});
    })
});

// Get a one car
app.get('/Collection/api/v1/cars/:id',(req,res)=>{
  const id = req.params.id;
  if(ObjectId.isValid(id)){
    db.collection('Product')
    .findOne({_id:new ObjectId(id)})
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({error:"Error in fetching data"});
    })
  }else{
    res.status(400).json({error:"Invalid ID"});
  }
});

// Add a car
app.post('/Collection/api/v1/cars',cookieJwtAuth,(req,res)=>{
  const user = req.user;
  if(user.role !== 'Admin') 
    return res.status(400).json({msg:"You cannot add because you are not an admin"});

  const car = req.body;
  db.collection('Product')
  .insertOne(car)
  .then(() => {
    res.status(201).json({msg:"Added Successfully"});
  })
  .catch((err) => {
    res.status(500).json({error:"Error in adding"});
  })

});

// Update a car
app.patch('/Collection/api/v1/cars/:id',cookieJwtAuth,(req,res)=>{
  const user = req.user;
  if(user.role !== 'Admin') 
    return res.status(400).json({msg:"You cannot update because you are not an admin"});
  
  const updates = req.body;
  const id = req.params.id;
  if(ObjectId.isValid(id)){
    db.collection('Product')
    .updateOne({_id:new ObjectId(id)},{$set:updates})
    .then(() => {
      res.status(200).json({msg:"Updated Successfully"});
    })
    .catch((err) => {
      res.status(500).json({msg:"Error in updating"});
    })
  }else{
    res.status(400).json({error:"Invalid ID"});
  }
});

// Delete a car
app.delete('/Collection/api/v1/cars/:id',cookieJwtAuth,(req,res)=>{
  const user = req.user;
  if(user.role !== 'Admin') 
    return res.status(400).json({msg:"You cannot delete because you are not an admin"});
  
  const id = req.params.id;
  if(ObjectId.isValid(id)){
    db.collection('Product')
    .deleteOne({_id:new ObjectId(id)})
    .then(() => {
      res.status(204).json({msg:"Deleted Successfully"});
    })
    .catch((err) => {
      res.status(500).json({msg:"Error in Deleting"});
    })
  }else{
    res.status(400).json({error:"Invalid ID"});
  }
});

// Search for car
app.get('/Collection/api/v1/cars/search/:carName', (req, res) => {
  const carName = req.params.carName;
  let cars = [];
  db.collection('Product')
  .find({ model: { $regex: carName, $options: 'i' } })
  .forEach(car => cars.push(car))
  .then(() => {
    if(cars.length > 0)
      return res.json(cars);
    res.status(404).json({ msg: "No cars found" });
  }).catch((err) => {
    res.status(500).json({ msg: "Error in getting car"});
  });
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});