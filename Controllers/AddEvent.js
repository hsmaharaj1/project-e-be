const Events = require('../Models/EventsModel')
const UserEvent = require('../Models/UserEventModel')
const jwt = require("jsonwebtoken")

module.exports.addEvent = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id

        const { eventName, description, location, note, groupSize, eventDate } = req.body
        const event = await Events.create({ 
            madeby: userId, 
            eventName, 
            description, 
            location, 
            note, 
            groupSize, 
            eventDate 
        })
        await UserEvent.create({userId, eventId:event._id, role:'creator'})
        res.status(201).json({ success: true, event })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}