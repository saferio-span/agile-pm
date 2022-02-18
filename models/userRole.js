
import mongoose from 'mongoose'

const UserRoleSchema = new mongoose.Schema({
  roleId: { 
    type: Number,
  },
  roleName: {
    type: String
  },
  createdBy:{
    type: String 
  }
}, { timestamps: true })

// UserSchema.methods.comparePassword = function(password) {
//   return bcrypt.compareSync(password, this.password);
// };

let Dataset = mongoose.models.userRole || mongoose.model('userRole', UserRoleSchema)
export default Dataset;