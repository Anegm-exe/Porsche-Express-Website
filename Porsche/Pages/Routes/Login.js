const jwt = require('jsonwebtoken');
const MongoClient = require('mongodb').MongoClient;

module.exports = async (req, res) => {
    const { Email, Password } = req.body;
    const client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('porsche');
    const collection = db.collection('Customer');
    console.log(Email + " " + Password);
    const user = await collection.findOne({ email : Email });
    if (!user) {
        collection = db.collection('Admin');
        user = await collection.findOne({ email : Email });
        if (!user) return res.status(400).json({ message: 'User does not exist' });
    }
    
    const isMatch = await bcrypt.compare(Password, user.password);
    if (!isMatch) {
        return res.status(403).send('Invalid password');
    }

    delete user.Password;
    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, {
        httpOnly: true
    });
    return res.redirect('/Home');
};