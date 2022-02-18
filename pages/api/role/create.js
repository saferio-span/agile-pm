import connectDB from "../../../config/connectDB";
import Role from "../../../models/userRole"
connectDB()

export default async function handler(req,res)
{
    const {name,createdBy} = req.body

    const existingRole = await Role.find().sort({roleId:-1}).limit(1)
    console.log(existingRole);

    const role = new Role()
    if(existingRole.length == 0)
    {
        role.roleId = 1
    }
    else
    {
        role.roleId = existingRole[0].roleId+1
    }

    role.roleName = name
    role.createdBy = createdBy

    console.log(role);

    // res.status(200).send(existingRole)

    //
    // role.roleId = existingRoleId+1
    // role.name = name
    // role.createdBy = createdBy

    await role.save(
        (err, roleCreated)=>{
        if (err) {
            res.status(401).send(err);
        } else {
            console.log(roleCreated);
            res.status(200).send(roleCreated);
        }
    });
}

