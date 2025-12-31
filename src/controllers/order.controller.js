import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"
import { sendemail } from "../utils/email.js"
import { Async } from "../utils/asynchandler.js"

export const createorder = Async(async (req, res) => {
    const { productid, quantity } = req.body
    const userid = req.userid

    const product = await Product.findById(productid)

    if (!product) {
        const error = new Error("Product not found");
        error.statusCode = 404;
        throw error;
    }

    if (product.stock < quantity) {
        const error = new Error("Out of stock");
        error.statusCode = 400;
        throw error;
    }

    product.stock = product.stock - quantity

    await product.save()

    const order = await Order.create({
        user: userid,
        product: productid,
        quantity: quantity,
        totalPrice: product.price * quantity
    })

    const user = await User.findById(userid)

    await sendemail(
        user.email,
        "Order Confirmation",
        `Hello ${user.name},\n\nYour order for ${quantity} x ${product.name} has been placed!\nTotal Price: $${order.totalPrice}`
    )
    res.status(201).json({
        message: "Order successfull!",
        order
    })
})


export const getorder = Async(async (req, res) => {
    const userid = req.userid

    const order = await Order.find({ user: userid })
        .populate("product", "name price")
        .populate("user", "name email")

    res.json(order)
})

export const cancelorder = Async(async (req, res) => {
    const { orderid } = req.body
    const userid = req.userid

    const order = await Order.findById(orderid)

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    if (order.user.toString() !== userid) {
        const error = new Error("You are not authorized to cancel this order");
        error.statusCode = 403;
        throw error;
    }

    if (order.status === "shipped" || order.status === "delivered") {
        const error = new Error("Cannot cancel order that has already been shipped");
        error.statusCode = 400;
        throw error;
    }


    if (order.status === "cancelled") {
        const error = new Error("Order is already cancelled");
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findById(order.product)

    if (product) {
        product.stock = product.stock + order.quantity
        await product.save()
    }

    order.status = "cancelled"
    await order.save()

    const user = await User.findById(userid)

    await sendemail(
        user.email,
        "Order Cancelled",
        `Hello ${user.name},\n\nYour order for ${product.name} has been cancelled`
    )
    res.status(201).json({
        message: "Order cancelled successfull!",
        order
    })

})

export const getallorder = Async(async (req, res) => {

    const allorder = await Order.find({})
        .populate("product", "name price image")
        .populate("user", "name email")
        .sort({ createdAt: -1 })

    res.status(200).json(allorder)
})

export const updateoderstatus = Async(async (req, res) => {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findById(id)

    if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
    }

    const normalizedStatus = status.toLowerCase();
    const validStatuses = ["shipped", "pending", "delivered", "cancelled"];

    if (!validStatuses.includes(normalizedStatus)) {
        const error = new Error("Invalid status");
        error.statusCode = 400;
        throw error;
    }

    order.status = normalizedStatus
    await order.save()

    res.status(200).json({
        success: true,
        message: "Status updated successfully",
        order
    })
})

export const payorder = Async(async (req, res) => {
    const { orderid } = req.body

    const order = await Order.findById(orderid)

    if (!order) {
        return res.status(404).json({ message: "Order not found" })
    }

    if (order.ispaid) {
        return res.status(400).json({ message: "Order is already paid!" })
    }

    const fakePaymentId = `PAY_FAKE_${Date.now()}`;

    order.ispaid = true
    order.paidat = Date.now()
    order.paymentid = fakePaymentId

    const updatedOrder = await order.save()

    res.status(200).json({
        success: true,
        message: "Payment Successful (Simulator)",
        order: updatedOrder
    })
})