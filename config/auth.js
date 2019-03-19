
const jwt = require('jsonwebtoken');
//get token to compare within GET requests
module.exports = {
    ensureAuthenticated: function (req, res ,next) {
        const token = decodeToken(req)
        if(!token){
            res.status(401).json({message:'You are not authenticated'})
        }
        next()
    }
};
function decodeToken(req){
    const token = req.headers.authorization || req.headers['authorization']
    if(!token){
        return null
    }
    try {
        return jwt.verify(token, 'gzGrabberSecret')
    } catch (error){
        return null
    }
}