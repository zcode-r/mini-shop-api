import dns from 'node:dns'
dns.setDefaultResultOrder('ipv4first')
import express from 'express'
import cookieParser from 'cookie-parser'
import DB from './config/db.js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path'
import cors from 'cors'
import './config/nodemailer.js'
import productroute from './routes/product.route.js'
import userroute from './routes/user.route.js'
import orderroute from './routes/order.routes.js'
import errorHandler from './middlewares/errorhandler.js'

dotenv.config()
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use(cors())
await DB()
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Mini Shop API 🛒</h1>");
});

app.use('/api/product', productroute)
app.use('/api/user', userroute)
app.use('/api/order', orderroute)

app.use(errorHandler)

app.listen(process.env.PORT, () => {
    console.log("server is running")
})