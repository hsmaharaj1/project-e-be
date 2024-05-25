const UserEvent = require('../Models/UserEventModel')
const Events = require('../Models/EventsModel')
const jwt = require('jsonwebtoken')

// Fetching all the events created by the user
module.exports.fetchCreatedEvents = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id
        // console.log(userId)
        const events = await UserEvent.find({ userId, role: 'creator' }).populate('eventId')

        const futureEvents = events
            .map(userEvent => userEvent.eventId)
            .filter(event => new Date(event.eventDate) >= Date.now())

        res.status(200).json({ success: true, futureEvents })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
}

// Getting all the requested events by a user
module.exports.fetchRequestedEvents = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" })
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY)
        const userId = decoded.id

        const events = await UserEvent.find({ userId, role: 'requested' }).populate('eventId')
        const futureEvents = events
            .map(userEvent => userEvent.eventId)
            .filter(event => new Date(event.eventDate) >= Date.now())

        res.status(200).json({ success: true, futureEvents })

    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: "Server error" })
    }
};

// Getting all the requests for a particular event
module.exports.fetchRequestsForEvent = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decoded.id;
        const { eventId } = req.params;

        const currEvent = await Events.findById(eventId);
        if (!currEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        if (currEvent.groupSize <= currEvent.currSize) {
            return res.json({ success: false, message: "Group is full" });
        }

        // Check to only show the requests to the creator
        const isCreator = await UserEvent.findOne({ userId, eventId, role: 'creator' });
        if (!isCreator) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const users = await UserEvent.find({ eventId, role: 'requested' }).populate('userId');
        res.status(200).json({ success: true, users: users.map(userEvent => userEvent.userId) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Get a event details
module.exports.eventDetails = async (req, res, next) => {
    try {
        const { eventId } = req.params
        const event = await Events.findById(eventId)
        if (!event) {
            return res.status(404).json({ message: 'Event not found' })
        }
        res.json(event)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}