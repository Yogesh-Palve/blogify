const JWT = require("jsonwebtoken")

const secret = "$uperMan@123" // confidential should not be shared 

function createTokenForUser(user) {
    const payload = {
        _id : user._id,
        name : user.fullName,
        email : user.email,
        profileImageURL : user.profileImageURL,
        role : user.role,
    }
    const token = JWT.sign(payload, secret) // u can set expiry also 
    return token
}

function validateToken(token) {
    const payload = JWT.verify(token, secret)
    return payload
}

module.exports = {
    createTokenForUser,
    validateToken,
}