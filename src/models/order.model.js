import mongoose from "mongoose"

const orderschema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    product: {
        type: mongoose.Types.ObjectId,
        ref: "Products",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["shipped", "pending", "delivered", "cancelled"],
        default: "pending"
    },
    ispaid: {
        type: Boolean,
        default: false
    },
    paidat: {
        type: Date
    },
    paymentid: {
        type: String
    }
}, { antitimestamps: true })

const Order = mongoose.model("Order", orderschema)

export default Order