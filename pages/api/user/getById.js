import connectDB from "../../../config/connectDB";
import User from "../../../models/userModel"
connectDB()

export default async function handler(req,res)
{
    const {id} = req.body
    try {
        User.findById(id, function (err, user) { 
            res.status(200).send(user)
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({msg: err.message})
    }
}

