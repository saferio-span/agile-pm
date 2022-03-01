import connectDB from "../../../config/connectDB";
import Role from "../../../models/userRole"
connectDB()

export default async function handler(req,res)
{
    try {
        const roles = await Role.find();
        res.status(200).send(roles)
        // console.log(roles)
    } catch (err) {
        console.log(err)
        res.status(500).json({msg: err.message})
    }
}

