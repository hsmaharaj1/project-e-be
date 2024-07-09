const { HarmCategory } = require("firebase/vertexai-preview")
const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema({
    madeby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    eventName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    budget:{
        type: String,
        required: false
    },
    location: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        required: false
    },
    groupSize: {
        type: Number,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    listedDate: {
        type: Date,
        default: Date.now
    },
    currSize: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model("Event", eventSchema)