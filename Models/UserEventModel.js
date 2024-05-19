const mongoose = require("mongoose")

const userEventSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event', 
        required: true
    },
    role: {
        type: String,
        enum: ['creator', 'requested', 'accepted'],
        required: true
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    responseDate: {
        type: Date
    }
})

module.exports = mongoose.model('UserEvent', userEventSchema)