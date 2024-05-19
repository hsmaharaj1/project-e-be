// For sending requests to join

const UserEvent = require('../Models/UserEventModel');
const Events = require('../Models/EventsModel');
const jwt = require("jsonwebtoken");

module.exports.joinEvent = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        const userId = decoded.id;
        const { eventId } = req.body;

        const currEvent = await Events.findById(eventId);
        if (!currEvent) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        if (currEvent.groupSize <= currEvent.currSize) {
            return res.status(400).json({ success: false, message: "Event is already full" });
        }

        const existingRequest = await UserEvent.findOne({ userId, eventId });
        if (existingRequest) {
            return res.status(400).json({ success: false, message: "Request already exists" });
        }

        const request = await UserEvent.create({ userId, eventId, role: 'requested' });
        res.status(201).json({ success: true, request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}