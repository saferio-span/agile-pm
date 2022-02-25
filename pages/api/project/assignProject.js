import connectDB from "../../../config/connectDB";
import ProjectUsers from "../../../models/projectUsersModel"
connectDB()

export default async function handler(req,res)
{
    const {projectId, userIds} = req.body    

    const assignProject = new ProjectUsers()
    assignProject.projectId = projectId
    assignProject.users = userIds

    //console.log(assignProject);

    await assignProject.save(
        (err, projectCreated)=>{
        if (err) {
            res.status(401).send(err);
        } else {
            console.log(projectCreated);
            res.status(200).send(projectCreated);
        }
    });
}

