# 🛒 Mini Shop API

A robust backend REST API for an E-commerce application.
Built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Live Demo
**Base URL:** `https://mini-shop-api-e8fr.onrender.com`

## ✨ Features
- **User Authentication**: Sign up, Login & Password Reset with JWT.
- **Email Notifications**: Automated emails for password resets using **Nodemailer**.
- **Product Management**: Create, Read, Edit, Delete (CRUD) products.
- **Image Uploads**: Integrated with **Cloudinary** for image storage.
- **Order System**: Place orders and track stock inventory.
- **Payment Simulator**: Custom-built internal logic to simulate transaction success/failure states.
- **Security**: Password hashing (bcrypt) and protected routes.

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Image Storage:** Cloudinary
- **Email Service:** Nodemailer
- **Authentication:** JWT & bcrypt
- **Tools:** Postman (for testing), Render (for deployment)

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/zcode-r/mini-shop-api.git]

```

2. **Install Dependencies**
```bash
npm install

```


3. **Environment Variables**
Create a `.env` file in the root directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Image Uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Service (Nodemailer)
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

```


4. **Start the Server**
```bash
npm start

```



## 🔌 API Endpoints

### 👤 User Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/user/register` | Register a new user |
| `POST` | `/api/user/login` | Login user & get Token |
| `POST` | `/api/user/logout` | Logout user |
| `POST` | `/api/user/forgot-password` | Request password reset link (Sent via Email) |
| `POST` | `/api/user/reset-password/:token` | Reset password using token |

### 📦 Product Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/product/all` | Get all products |
| `POST` | `/api/product/create` | Create a product (Admin only) |
| `PUT` | `/api/product/edit/:id` | Edit product details (Admin only) |
| `DELETE` | `/api/product/delete/:id` | Delete a product (Admin only) |

### 🛒 Order Routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/order/buy` | Place a new order |
| `GET` | `/api/order/myorder` | Get logged-in user's orders |
| `POST` | `/api/order/cancle` | Cancel an order |
| `POST` | `/api/order/pay` | Simulate Payment (Updates status to Paid) |
| `GET` | `/api/order/get-allorder` | Get ALL orders (Admin only) |
| `PUT` | `/api/order/update-status/:id` | Update Order Status (Admin only) |

## 🧪 How to Test

You can use **Postman** or **Thunder Client** to test the API.

1. **Login** to get your `token`.
2. Add the token to the **Headers** (`Authorization: Bearer <your_token>`) for protected routes.
3. Hit the **Endpoints** listed above.

```
