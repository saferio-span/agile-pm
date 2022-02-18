import connectDB from "../../../config/connectDB";
import Role from "../../../models/userRole"
connectDB()

export default async function handler(req,res)
{
    const {id} = req.body
    try {
        await Role.deleteOne({ _id: id });
        res.status(200).send("Successfully Deleted")    
    } catch (error) {
        console.log(error);
        res.status(400).send(error)    
    }
}

