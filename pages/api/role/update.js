import connectDB from "../../../config/connectDB";
import Role from "../../../models/userRole"
connectDB()

export default async function handler(req,res)
{
    const {id,name} = req.body
    await Role.findOneAndUpdate({_id: id },{roleName:name},(err,data)=>{
        if(err)
        {
            return res.status(400).send(err)
        }
        return res.status(200).send(data)
    }).clone().catch(function(err){ console.log(err)})
}

