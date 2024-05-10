const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

module.exports = async (req, res,next) => {
    const { email, password } = req.body;
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('porsche');
    let collection = db.collection('Customer');
    let user = await collection.findOne({ email: email });
    let role = 'customer';

    if (!user) {
        collection = db.collection('Admin');
        user = await collection.findOne({ email: email });
        role = 'admin';
        if (!user) return res.status(400).json('User does not exist');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(403).json('Invalid password');
    }

    delete user.password;
    delete user.cart;
    
    user.role = role; // Add role to user
    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
    client.close(); 

    res.cookie("token", token, {
        httpOnly: true
    });
    res.status(200).json({message:"Login successful !"});
};
