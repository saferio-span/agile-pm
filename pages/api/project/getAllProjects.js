import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res)
{   
    try {
        const PAGE_SIZE = 2;
        const page = parseInt(req.query.page || "0")
        const search = req.query.searchTerm;
        let total;
        let projects;

        console.log('page', page);
        console.log('search', search);

        if(search == "null"){
            total = await Project.countDocuments({});
            projects = await Project.find()
                .limit(PAGE_SIZE)
                .skip(PAGE_SIZE * page);
            console.log('In');
            console.log(total);
            console.log(projects);
        }
        else{
            total = await Project.find({ projectname :  {'$regex': search}}).count()
            projects = await Project.find({ projectname :  {'$regex': search}})
            .limit(PAGE_SIZE)
            .skip(PAGE_SIZE * page);
            console.log('Search', search);
            console.log('Out', projects);
            console.log(total);
            console.log(projects);
        }
        
        // res.send([])
        res.status(200).json({
            totalpages: Math.ceil(total / PAGE_SIZE), 
            projects})

    } catch (err) {
        console.log(err)
        res.status(500).json({msg: err.message})
    }
}