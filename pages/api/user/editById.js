import connectDB from "../../../config/connectDB";
import User from "../../../models/userModel"
connectDB()

export default async function handler(req,res)
{
    const {_id, name, email, userRole, globalAccess, mobile } = req.body
    console.log(req.body)
    User.findByIdAndUpdate(_id, {name, email, userRole, globalAccess, mobile}, (err) => {
        if (err) {
            console.log(err);
            res.status(401).send('Failed');
        } else {
            res.status(200).send('Successfully Updated')
        }
    })

    // res.status(200).send(req.body);
}