import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res)
{
    try {
        const projects = await Project.find();
        res.status(200).send(projects)
    } catch (err) {
        console.log(err)
        res.status(500).json({msg: err.message})
    }
}