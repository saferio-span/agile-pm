import connectDB from "../../../config/connectDB";
import User from "../../../models/userModel"
connectDB()

export default async function handler(req,res)
{
    try {
        const users = await User.find();
        res.status(200).send(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({msg: err.message})
    }
}

