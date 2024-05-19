// For accepting the requests

const UserEvent = require('../Models/UserEventModel')
const Events = require('../Models/EventsModel')
const jwt = require('jsonwebtoken')

module.exports.acceptRequest = async (req, res, next) => {
    try{
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({status: false, message: "No token"})
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id
        const { userToAccept, eventId} = req.body

        const currentEvent = await Events.findById(eventId)
        if(!currentEvent){
            return res.status(404).json({success: false, message: "Event not found"})
        }
        if(currentEvent.groupSize <= currentEvent.currSize){
            return res.json({success: false, message: "Already full"})
        }
        const newSize = currentEvent.currSize + 1;
        const request = await UserEvent.findOneAndUpdate(
            { userId:userToAccept, eventId, role:'requested' },
            {role: 'accepted', responseDate: new Date()},
            {new: true}
        )
        if(!request){
            return res.status(404).json({success: false, message: "Request not found"})
        }

        // Updating the current size of the group
        const event = await Events.findByIdAndUpdate(
            eventId,
            { currSize: newSize },
            {new: true}
        )

        return res.status(200).json({success: true, request, event})

    }catch (error){
        console.log(error)
    }
}