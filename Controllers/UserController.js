const UserData = require('../Models/UserData')
// const UserModel = require('../Models/UserModel')
const { getLocationDetails } = require('../util/getLocation')
const jwt = require('jsonwebtoken')

// Create a user
module.exports.createUser = async (req, res, next) => {
    try {
        const { userId, first_name, last_name, interests, dob, gender, bio, address } = req.body
        
        const locationDetails = await getLocationDetails(address)
        
        const user = new UserData({
            userId,
            first_name,
            last_name,
            interests,
            dob,
            gender,
            bio,
            location: locationDetails
        })
        
        await user.save()
        res.status(201).json({ success: true, user })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

// Update a user's data
module.exports.updateUser = async (req, res, next) => {
    try{
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id
        const user = await UserData.findOne({userId: userId})
        if(!user){
            return res.status(404).json({success: false, message: "User not found"})
        }

        const { first_name, last_name, interests, dob, gender, bio, address } = req.body
        
        if(first_name) user.first_name = first_name
        if(last_name) user.last_name = last_name
        if(interests) user.interests = interests
        if(dob) user.dob = dob
        if(gender) user.gender = gender
        if(bio) user.bio = bio
        if(address) {
            const locationDetails = await getLocationDetails(address)
            user.location = locationDetails
        }
        
        await user.save()

    } catch(error){
        console.log(error)
        res.status(500).json({success: false, message: "Server error"})
    }
}
