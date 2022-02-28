import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res)
{
    const {projectname, description, sessionUser} = req.body    

    const project = new Project()
    project.projectname = projectname
    project.description = description
    project.createdBy  = sessionUser

    console.log(project);

    await project.save(
        (err, projectCreated)=>{
        if (err) {
            res.status(401).send(err);
        } else {
            console.log(projectCreated);
            res.status(200).send(projectCreated);
        }
    });
}

