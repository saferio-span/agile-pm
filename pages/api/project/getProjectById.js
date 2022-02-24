import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req, res){
    const {id} = req.body
    //console.log(id);

    try{
        await Project.findById(id, function (err, project){
            res.status(200).send(project)
        }).clone().catch(function(err){ console.log(err)})
    }
    catch(err){
        console.log(err)
        res.status(500).json({msg: err.message})
    }
} 