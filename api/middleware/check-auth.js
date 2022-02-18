const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.query.auth;
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log('succeded!')
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};