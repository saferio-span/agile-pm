import connectDB from "../../../config/connectDB";
import Project from "../../../models/projectModel"
connectDB()

export default async function handler(req,res){
    const {id} = req.body
    //console.log(id);
    
    await Project.findByIdAndDelete(id, (err) => {
        if(err){
            console.log(err)
            res.status(401).send('Failed');
        }
        else{
            //console.log('Successfully deleted')
            res.status(200).send('Successfully deleted')
        }
    }).clone().catch(function(err){ console.log(err)})

    // res.send(id)
}