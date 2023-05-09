const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        unique: true,
        require: true
    },
    apartment: {
        type: String,
        require: true
    },
    street: {
        type: String,
        require: true
    },
    provider: {
        type: String,
        require: true
    },
    district: {
        type: String,
        require: true
    },
    city: {
        type: String,
    },

}, { timestamps: true })
module.exports = mongoose.model("User", userSchema)