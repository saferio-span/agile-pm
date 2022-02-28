import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res)
{
    const {projectname} = req.body

    try {
        const projectData = await Project.find({ projectname: projectname })
        res.json(projectData)
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg: err.message})
    }
}