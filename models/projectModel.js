
import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema({
  projectname: { 
    type: String
  },
  logoSrc: { 
    type: String
  },
  description: {
    type: String
  },
  createdBy:{
    type: String
  },
  createdAt:{
    type: Date,
    default: Date.now
  },
  updatedBy:{
    type: String,
    default: null
  },
  updatedAt:{
    type: Date,
    default: null
  }
}, { timestamps: true })


let Dataset = mongoose.models.projects || mongoose.model('projects', ProjectSchema)
export default Dataset;