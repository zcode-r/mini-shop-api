import Product from "../models/product.model.js"
import { uploadoncloudinary, deleteoncloudinary } from "../utils/cloudinary.js";
import { Async } from "../utils/asynchandler.js";

export const createProduct = Async(async (req, res) => {
  const { name, price, description, stock } = req.body

  let imageurl = ""

  if (req.file && req.file.path) {

    const imgurl = await uploadoncloudinary(req.file.path)

    if (imgurl) {
      imageurl = imgurl.secure_url
    }

  }

  if (!name || !price || !description) {
    const error = new Error("Please fill in all fields");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.create({
    name,
    price,
    description,
    stock,
    image: imageurl
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product
  });
});

export const getproduct = Async(async (req, res) => {
  // const allproduct=await Product.find()

  // if(allproduct.length==0){
  //     return res.status(200).json({ message: "No products found"})
  // }

  const page = Math.max(1, parseInt(req.query.page) || 1)
  const limit = Math.max(1, parseInt(req.query.limit) || 10)
  const skip = (page - 1) * limit

  const { search } = req.query

  const query = {}

  if (search) {
    query.name = { $regex: search, $options: 'i' }
  }

  const total = await Product.countDocuments(query)

  const products = await Product.find(query)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      totalProducts: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      itemsPerPage: limit
    }
  })
})

export const deleteproduct = Async(async (req, res) => {
  const { id } = req.params

  const product = await Product.findByIdAndDelete(id)

  if (!product) {
    const error = new Error("Product not found!");
    error.statusCode = 404;
    throw error;
  }

  if (product.image) {
    await deleteoncloudinary(product.image)
  }

  res.status(200).json({
    success: true,
    message: "Product deleted successfully"
  })
})

export const editproduct = Async(async (req, res) => {
  const { id } = req.params
  const { name, price, stock, description } = req.body

  const product = await Product.findById(id)

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  let imagepath = product.image

  if (req.file) {
    const imgurl = await uploadoncloudinary(req.file.path)

    if (imgurl) {
      // Delete old image if it exists and is not the default
      if (product.image && product.image !== 'No-image.png') {
        await deleteoncloudinary(product.image)
      }
      imagepath = imgurl.secure_url;
    }
    else {
      console.log("Upload failed or returned null. Using old image.");
    }
  } else {
    console.log("No file part in request.");
  }

  const updated = await Product.findByIdAndUpdate(id,
    {
      name,
      price,
      stock,
      description,
      image: imagepath
    },
    { new: true, runValidators: true }
  )
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updated
  })
})