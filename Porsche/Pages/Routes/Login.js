const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');


module.exports = async (req, res) => {
    const { email, password } = req.body;
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('porsche');
    const collection = db.collection('Customer');
    const user = await collection.findOne({ email : email });
    if (!user) {
        collection = db.collection('Admin');
        user = await collection.findOne({ email : email });
        if (!user) return res.status(400).json({ message: 'User does not exist' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(403).send('Invalid password');
    }

    delete user.password;
    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
    client.close();

    res.cookie("token", token, {
        httpOnly: true
    });
    res.json({ status: 'success', redirect: '/Home' });
};