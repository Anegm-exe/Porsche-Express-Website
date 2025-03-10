const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { cookieJwtAuth } = require('./Porsche/Pages/Middleware/cookieJwtAuth');
require('dotenv').config();
const axios = require('axios');

// Express App
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const PORT = process.env.PORT || 3000;
axios.defaults.baseURL = `http://localhost:${PORT}`;
// MongoDB connection
const { MongoClient, ObjectId } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);
client.connect();
const db = client.db('porsche');

const publicPath = path.join(__dirname,'Porsche/Pages');
app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

// SignUp
const SignUpRoute = require('./Porsche/Pages/Routes/SignUp');
app.post('/SignUp', SignUpRoute);

// Login 
const loginRoute = require('./Porsche/Pages/Routes/Login');
app.post('/SignIn', loginRoute);

// Get all cars
app.get('/Collection/api/v1/cars',(req,res)=>{
  let cars = [];
  db.collection('Product')
    .find()
    .forEach(car => cars.push(car))
    .then(()=>{
      return res.status(200).json({cars:cars});
    }).catch((err)=>{
      return res.status(500).json({error:"Error in fetching data"});
    })
});

// Get a one car
app.get('/Collection/api/v1/cars/:id', (req, res) => {
  const id = req.params.id;
  if (ObjectId.isValid(id)) {
      db.collection('Product')
          .findOne({ _id: new ObjectId(id) })
          .then(car => {
              if (car) {
                  return res.status(200).json({ car: car });
              } else {
                  // No car found with the given ID
                  return res.status(404).json({ error: "Car not found" });
              }
          })
          .catch((err) => {
              return res.status(500).json({ error: "Error in fetching data" });
          })
  } else {
      return res.status(400).json({ error: "Invalid ID" });
  }
});


// Add a car
app.post('/Collection/api/v1/cars',cookieJwtAuth,(req,res)=>{
  const user = req.user;
  if(user.role !== 'admin') 
    return res.status(400).json({error:"You cannot add because you are not an admin"});

  const car = req.body;
  db.collection('Product')
  .insertOne(car)
  .then(() => {
    return res.status(201).json({message:"Added Successfully"});
  })
  .catch((err) => {
    return res.status(500).json({error:"Error in adding"});
  })

});

// Update a car
app.patch('/Collection/api/v1/cars/:id',cookieJwtAuth,(req,res)=>{
  const user = req.user;
  if(user.role !== 'admin') 
    return res.status(400).json({msg:"You cannot update because you are not an admin"});
  
  
  const updates = req.body;
  const id = req.params.id;

  updates.stock = parseInt(updates.stock);
  updates.Price = parseInt(updates.Price);
  updates.Num_seats = parseInt(updates.Num_seats);

  if(updates.model === '')
    delete updates.model;
  if(updates.Price === '' || isNaN(updates.Price))
    delete updates.Price;
  if(updates.Num_seats === '' || isNaN(updates.Num_seats))
    delete updates.Num_seats;
  if(updates.color === '')
    delete updates.color;
  if(updates.image === '')
    delete updates.image;
  if(updates.stock === ''|| isNaN(updates.stock))
    delete updates.stock;
  if(updates.type === '')
    delete updates.type;

  if(ObjectId.isValid(id)){
    db.collection('Product')
    .updateOne({_id:new ObjectId(id)},{$set:updates})
    .then(() => {
      return res.status(200).json({message:"Updated Successfully"});
    })
    .catch((err) => {
      return res.status(500).json({error:"Error in updating"});
    })
  }else{
    return res.status(400).json({error:"Invalid ID"});
  }
});

// Delete a car
app.delete('/Collection/api/v1/cars/:id',cookieJwtAuth,(req,res)=>{
  const user = req.user;
  if(user.role !== 'admin') 
    return res.status(400).json({error:"You cannot delete because you are not an admin"});
  
  const id = req.params.id;
  if(ObjectId.isValid(id)){
    db.collection('Product')
    .deleteOne({_id:new ObjectId(id)})
    .then(() => {
      return res.status(200).json({ message :"Deleted Successfully"});
    })
    .catch((err) => {
      return res.status(500).json({error:"Error in Deleting"});
    })
  }else{
    return res.status(400).json({error:"Invalid ID"});
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
      return res.status(200).json({cars:cars});
    return res.status(404).json({ error : "No cars found" });
  }).catch((err) => {
    return res.status(500).json({ error : "Error in getting car"});
  });
});

// Add inside cart
app.post('/Profile/api/v1/cart/:productId',cookieJwtAuth, (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  
  db.collection('Customer').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { cart: productId } }
  )
  .then(() => {
    return res.status(200).json({message : 'Product added to cart'});
  })
  .catch((err) => {
    return res.status(500).json({error : 'An error occurred'});
  });
});

// delete from cart
app.delete('/Profile/api/v1/cart/:productId', cookieJwtAuth, (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;
  db.collection('Customer').findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull : { cart : productId } }
  )
  .then(() => {
    return res.status(200).json({message : 'Product removed from cart'});
  })
  .catch((err) => {
    return res.status(500).json({error:'An error occurred while deleting'});
  });
});


// get cart items
app.get('/Profile/api/v1/cart', cookieJwtAuth, async (req, res) => {
  const userId = req.user._id;
  let collection = db.collection('Customer');
  const cart = await collection.findOne(
    { _id: new ObjectId(userId) },
    { projection: { cart: 1, _id: 0 } }
  );
  let carDetails = [];
  try {
    for (const carId of cart.cart) {
      try {
        const response = await axios.get(`/Collection/api/v1/cars/${carId}`);
        carDetails.push(response.data); 
      } catch (error) {
        carDetails.push({
          _id: carId,
          message: `Car with ID ${carId} is unavailable.`
        });
      }
    }
    return res.status(200).json(carDetails);
  } catch (error) {
    return res.status(500).json({error:'Error while fetching cart'});
  }
});

app.patch('/Profile/api/v1/purchase', cookieJwtAuth, async (req, res) => {
  const userId = req.user._id;

  try {
      // Retrieve the user's cart from the database
      const userCart = await db.collection('Customer').findOne({ _id: new ObjectId(userId) });

      if (!userCart) {
          return res.status(404).json({ error: "Cart not found" });
      }

      // Get the details of each item in the cart
      const carDetailsPromises = userCart.cart.map(async (itemId) => {
          try {
              const response = await axios.get(`/Collection/api/v1/cars/${itemId}`);
              return response.data.car; // Assuming the car details are returned under the "car" key
          } catch (error) {
              console.error(`Failed to fetch car details for item ${itemId}: ${error}`);
              return null; // Return null for failed requests
          }
      });

      // Wait for all car details requests to complete
      const carDetails = await Promise.all(carDetailsPromises);

      // Calculate the total price of all items in the cart
      const totalPrice = carDetails.reduce((total, car) => {
          if (car && car.Price) {
              return total + car.Price;
          }
          return total;
      }, 0);

      // Clear the user's cart in the database
      await db.collection('Customer').updateOne({ _id: new ObjectId(userId) }, { $set: { cart: [] } });

      // Return a JSON response containing the total price
      return res.status(200).json({ message:"Thank you for purchaseing the total is " + totalPrice });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});