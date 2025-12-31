import express from 'express'
import { createProduct ,getproduct ,editproduct,deleteproduct} from '../controllers/product.controller.js'
import { verifytoken , verifyadmin} from '../middlewares/auth.middleware.js'
import upload from '../middlewares/uploadmiddleware.js'

const route=express.Router()

route.get('/all',getproduct)
route.post('/create',verifytoken,verifyadmin,upload.single('image'),createProduct)
route.put('/edit/:id',verifytoken,verifyadmin,upload.single('image'),editproduct)
route.delete('/delete/:id',verifytoken,verifyadmin,deleteproduct)

export default route