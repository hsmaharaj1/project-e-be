// middlewares/verifyToken.js
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ status: false, message: "No token provided" })
    }

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: "Invalid token" })
        }
        req.userId = decoded.id
        next()
    })
}

module.exports = verifyToken
