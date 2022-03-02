import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res)
{   
    try {
        const PAGE_SIZE = 2;
        const page = parseInt(req.query.page || "0")
        const total = await Project.countDocuments({});
        const projects = await Project.find()
            .limit(PAGE_SIZE)
            .skip(PAGE_SIZE * page);
        res.status(200).json({
            totalpages: Math.ceil(total / PAGE_SIZE), 
            projects})
    } catch (err) {
        console.log(err)
        res.status(500).json({msg: err.message})
    }
}