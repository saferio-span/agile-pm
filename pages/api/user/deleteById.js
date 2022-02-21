import connectDB from "../../../config/connectDB";
import User from "../../../models/userModel"
connectDB()

export default async function handler(req,res)
{
    const {id} = req.body

    User.findByIdAndDelete(id, (err) => {
        if (err) {
            console.log(err);
            res.status(401).send('Failed');
        } else {
            res.status(200).send('Successfully Deleted')
        }
    })
}