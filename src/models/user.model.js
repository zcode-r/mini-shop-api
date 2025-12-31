import mongoose from "mongoose"

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    isadmin: {
        type: Boolean,
        default: false
    },
    resetpasswordtoken: String,
    resetpasswordexpire: Date
}, { timestamps: true })

const User = mongoose.model("User", userschema)

export default User