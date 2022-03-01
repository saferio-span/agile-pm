import connectDB from "../../../../config/connectDB";
import User from "../../../../models/userModel"
connectDB()

export default async function handler(req,res)
{
    const {_id,isActive} = req.body
     try{
        const data = await User.findByIdAndUpdate(_id, {isActive})
        if(data === null){
            res.status(404).send('User not found');
        }
        else{
            res.status(202).send('Successfully Updated')
        }
        
    } catch(e) {
        res.status(401).send('Failed');
    }
}