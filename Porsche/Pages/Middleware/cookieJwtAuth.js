const jwt = require('jsonwebtoken');

exports.cookieJwtAuth = (req, res, next) => {
    const token = req.body.cookies.token;
    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token");
        return res.status(400).json({message:'Session ended please signin again'});
    }
}