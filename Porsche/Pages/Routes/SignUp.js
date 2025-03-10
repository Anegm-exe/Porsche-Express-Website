const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = async (req, res) => {
    const { Fname, Lname, email, password, confirmPassword, dob } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({error:'Passwords do not match'});
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('porsche');
    const usersCollection = db.collection('Customer');

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const dobDate = new Date(dob);

    const newUser = {
        First_name: Fname,
        Last_name: Lname,
        email: email,
        password: hashedPassword, // store the hashed password
        dob: dobDate,
        cart: []
    };

    try {
        await usersCollection.insertOne(newUser);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists'});
        } else {
            return res.status(500).json({ error: 'An error occurred'});
        }
    }
    return res.status(200).json({ message: "SignUp Succesful!" });
}