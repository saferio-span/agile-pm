import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res)
{
    const {id, projectname, logoSrc, description, updatedBy} = req.body
    console.log('In', req.body);
    await Project.findByIdAndUpdate({_id:id}, 
        {
            projectname, 
            logoSrc,
            description, 
            updatedBy
        }, (err, data) => {
            if (err) {
                console.log(err);
                res.status(401).send('Failed');
            } else {
                console.log(data)
                res.status(200).send(data)
            }
    }).clone().catch(function(err){ console.log(err)})

    res.send(req.body)
}