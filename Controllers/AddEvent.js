const Events = require('../Models/EventsModel');
const UserEvent = require('../Models/UserEventModel');
const jwt = require("jsonwebtoken");

// Add an event
module.exports.addEvent = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decoded.id;

        const { eventName, description, location, note, groupSize, eventDate } = req.body;
        const event = await Events.create({
            madeby: userId,
            eventName,
            description,
            location,
            note,
            groupSize,
            eventDate
        });
        await UserEvent.create({ userId, eventId: event._id, role: 'creator' });
        res.status(201).json({ success: true, event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update an event
module.exports.updateEvent = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id
        const { eventId } = req.params
        const event = await Events.findById(eventId)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        if (event.madeby.toString() !== userId) {
            return res.status(401).json({ message: 'User not authorized' })
        }

        const { eventName, description, location, note, groupSize, eventDate } = req.body
        
        if(eventName) event.eventName = eventName
        if(description) event.description = description
        if(location) event.location = location
        if(note) event.note = note
        if(groupSize) event.groupSize = groupSize
        if(eventDate) event.eventDate = eventDate

        await event.save()
        res.json({ success: true, event })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete an event
module.exports.deleteEvent = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token provided' })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id
        const { eventId } = req.params
        const event = await Events.findById(eventId)
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        if (event.madeby.toString() !== userId) {
            return res.status(401).json({ message: 'User not authorized' })
        }

        await UserEvent.deleteMany({ eventId: eventId })
        await Events.findByIdAndDelete(eventId)
        res.json({ success: true, message: 'Event removed' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};