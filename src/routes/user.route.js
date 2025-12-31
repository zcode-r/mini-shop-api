import express from 'express'
import { register,login,logout,forgotpassword,resetpassword} from '../controllers/user.controller.js'

const route=express.Router()

route.post('/register',register)
route.post('/login',login)
route.post('/logout',logout)

route.post('/forgot-password',forgotpassword)
route.post('/reset-password/:token',resetpassword)

export default route