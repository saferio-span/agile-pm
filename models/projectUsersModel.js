import mongoose from 'mongoose'

const projectUserSchema = new mongoose.Schema({  
    projectId: { 
        type: String
      },
    users: {
        type: Array
      },
}, {timestamps: true});


let Dataset = mongoose.models.projectUsers || mongoose.model('projectUsers', projectUserSchema)
export default Dataset;