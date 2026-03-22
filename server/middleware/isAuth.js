import jwt from 'jsonwebtoken'
const isAuth = async (req , res , next) =>
{
    
    try {
    const {token} = req.cookies
    if(!token)
    {
       return res.status(500).json({message:" There is no token in cookie"})
    }
    const verifyToken = jwt.verify(token,process.env.JWT_SECRET)
    if(!verifyToken)
    {
        return res.status(500).json({message:"no valid token"})
    }
    req.userId =verifyToken.userId
    next()
    } catch (error) {
        return res.status(500).json({message:`isAuth error ${error} `})
    }
}

export default isAuth ;