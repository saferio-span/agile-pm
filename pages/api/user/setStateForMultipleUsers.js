import connectDB from "../../../config/connectDB";
import User from "../../../models/userModel"
connectDB()

export default async function handler(req,res){
    const {ids,isActive} = req.body
try{
    const data = await User.updateMany({'_id' : {'$in':ids}},{isActive})
    if(data === null){
        res.status(404).send('User not found');
    }else{
        res.status(202).send('Successfully Updated')
    }  
} catch(e) {
    res.status(401).send('Failed');
}
}
        
   
