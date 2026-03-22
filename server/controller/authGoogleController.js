import User from "../model/userModel.js"
import genToken from "../config/token.js"

export const  googleAuth = async (req , res ) =>
{
     try {
        const {name , email } = req.body;
        let user = await User.findOne({email})
        if(!user)
            {
                user = await User.create({name , email })
            } 
            let token = await genToken(user._id)
            res.cookie("token" , token , {
                httpOnly :true , 
                secure : false ,
                sameSite : "strict",
                maxAge : 7*24*60*60*1000
            })

            return res.status(200).json(user)
     } catch (error) {
        return res.status(500).json({message:`error in creating a user is ${error}`})
     }
}

export const Logout = async ( req , res ) =>
{
    try {
        res.clearCookie("token")
        return res.status(200).json({message : "Successfully Logout "})
    } catch (error) {
         return res.status(500).json({message:`Logout error ${error}`}) 
    }
}