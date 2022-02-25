import mongoose from 'mongoose'

const projectUserSchema = new Schema({  
    projectId: { 
        type: String
      },
    users: {
        type: Array
      },
}, {timestamps: true});


let Dataset = mongoose.models.projectUsers || mongoose.model('projectUsers', projectUserSchema)
export default Dataset;