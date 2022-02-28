import connectDB from "../../../config/connectDB";
import User from "../../../models/userModel"
connectDB()

export default async function handler(req,res)
{
    const {email} = req.body

    try {
        const userData = await User.find({ email: email })
        res.status(200).send(userData)
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
}

