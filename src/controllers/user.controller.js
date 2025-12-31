import bcrypt from 'bcrypt'
import crypto, { hash } from 'crypto'
import jwt from 'jsonwebtoken'
import { sendemail } from '../utils/email.js';
import User from "../models/user.model.js";
import { Async } from "../utils/asynchandler.js";

export const register = Async(async (req, res) => {
    const { name, password, email } = req.body

    if (!name || !password || !email) {
        const error = new Error("Fill all the details");
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
        const error = new Error("Email already in use");
        error.statusCode = 400;
        throw error;
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await User.create({
        name,
        password: hash,
        email: normalizedEmail,
    })

    res.status(201).json({ message: 'User created' })
})

export const login = Async(async (req, res) => {
    const { email, password } = req.body

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 401;
        throw error;
    }

    const ok = await bcrypt.compare(password, user.password)

    if (!ok) {
        const error = new Error("Incorrect password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        { userid: user._id, isadmin: user.isadmin },
        process.env.SEC,
        { expiresIn: "1h" }
    )

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 1000
    })

    res.json({ message: "Login successful", user: { name: user.name, isAdmin: user.isadmin } })
})

export const forgotpassword = Async(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    const resettoken = crypto.randomBytes(20).toString('hex');

    user.resetpasswordtoken = resettoken;
    user.resetpasswordexpire = Date.now() + 3600000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resettoken}`;

    const message = `You requested a password reset. \n\nPlease go to this link to reset your password: \n\n${resetUrl}`;

    await sendemail(user.email, "Password Reset Request", message);

    res.status(200).json({ message: "Email sent!" });
})

export const resetpassword = Async(async (req, res) => {
    const { token } = req.params;
    const { newpassword } = req.body;

    const user = await User.findOne({
        resetpasswordtoken: token,
        resetpasswordexpire: { $gt: Date.now() }
    });

    if (!user) {
        const error = new Error("User not found or token expired");
        error.statusCode = 404;
        throw error;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newpassword, salt);

    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;

    await user.save();

    res.status(200).json('Password updated successfully');
})

export const logout = Async((req, res) => {

    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: false
    });

    res.status(200).json({ message: "Logged out successfully" });
});