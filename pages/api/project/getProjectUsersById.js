import connectDB from "../../../config/connectDB";
import ProjectUsers from "../../../models/projectUsersModel"
connectDB()

export default async function handler(req, res){
    const {id} = req.body
    //console.log(id);

    try{
        await ProjectUsers.find({"projectId":id}, function (err, projectUsers){
            res.status(200).send(projectUsers)
        }).clone().catch(function(err){ console.log(err)})
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg: err.message})
    }
} 