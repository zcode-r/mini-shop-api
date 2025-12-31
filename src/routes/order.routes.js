import express from 'express'
import { createorder, getorder, cancelorder, getallorder, updateoderstatus, payorder } from '../controllers/order.controller.js'
import { verifytoken, verifyadmin } from '../middlewares/auth.middleware.js'

const route = express.Router()

route.post('/buy', verifytoken, createorder)
route.get('/myorder', verifytoken, getorder)
route.post('/cancle', verifytoken, cancelorder)

route.get('/get-allorder', verifytoken, verifyadmin, getallorder)
route.put('/update-status/:id', verifytoken, verifyadmin, updateoderstatus)

route.post('/pay', verifytoken, payorder)

export default route