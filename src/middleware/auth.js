const jsw = require('jsonwebtoken')
const User = require('../models/user');
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jsw.verify(token, JSW_TOKEN);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
        if (!user) {
            throw new Error()
        }
        req.token = token;
        req.user = user;
    }
    catch (e) {
        res.status(401).send({ 'error': 'Please Authenticate. ' })
    }
    next();
}

module.exports = auth;