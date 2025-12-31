import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadoncloudinary = async (localfilepath) => {
    try {
        if (!localfilepath) return null

        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })

        fs.unlinkSync(localfilepath)
        return response
    }
    catch (err) {
        console.error("Cloudinary Upload Error:", err);
        try {
            if (fs.existsSync(localfilepath)) {
                fs.unlinkSync(localfilepath)
            }
        } catch (unlinkErr) {
            console.error("Error deleting local file after failed upload:", unlinkErr);
        }
        return null
    }
}

const deleteoncloudinary = async (imageurl) => {
    try {
        if (!imageurl) return null

        const publicid = imageurl.split('/').pop().split('.')[0]

        const response = await cloudinary.uploader.destroy(publicid)

        return response
    }
    catch (error) {
        console.log("Error deleting from Cloudinary:", error)
        return null
    }
}

export { uploadoncloudinary, deleteoncloudinary }