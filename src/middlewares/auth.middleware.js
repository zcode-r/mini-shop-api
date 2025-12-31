import jwt from 'jsonwebtoken'

export const verifytoken= (req,res,next)=>{

    const token=req.cookies.token

    if(!token){
        return res.status(401).json({ message: "Not Authenticated!" })
    }

    jwt.verify(token,process.env.SEC,async(err,payload)=>{
        if (err) {
            return res.status(403).json({ message: "Token is not valid!" })
        }

        req.userid=payload.userid
        req.isadmin=payload.isadmin

        next()
    })
}

export const verifyadmin = (req, res, next) => {

  if (req.isadmin !== true) {
    return res.status(403).json({ message: "Hello Customer, you are not allowed here!" })
  }

  next()
}