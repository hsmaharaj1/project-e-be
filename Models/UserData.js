const mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
    },
    interests: {
        type: [String],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    location: {
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    }
})

module.exports = mongoose.model("UserData", userDataSchema)