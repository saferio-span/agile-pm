import connectDB from "../../../../config/connectDB"
import User from "../../../../models/userModel"
connectDB()

export default async function handler (req,res){
    const ids = req.body.ids
   await User.deleteMany({'_id' : {'$in':ids}},(err) => {
        if (err) {
            console.log(err);
            res.status(401).send('Failed');
        } else {
            res.status(200).send('Successfully Deleted')
        }
    }).clone()

}

