const mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    first_name: {
        type: String,
        required: false
    },
    last_name: {
        type: String,
    },
    interests: {
        type: [String],
        required: false
    },
    dob: {
        type: Date,
        required: false
    },
    gender: {
        type: String,
        required: false
    },
    bio: {
        type: String,
    },
    location: {
        address: { type: String, required: false },
        latitude: { type: Number, required: false },
        longitude: { type: Number, required: false }
    },
    isUpdated: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("UserData", userDataSchema)