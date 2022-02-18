import connectDB from "../../config/connectDB";
import User from "../../models/userModel"
import bcrypt from 'bcrypt';
connectDB()

export default async function handler(req,res)
{
    const {name,email,password,role} = req.body    

    const user = new User()
    user.name = name
    user.email = email
    user.password = await bcrypt.hash(password, 10)
    user.userRole = role

    console.log(user);

    await user.save(
        (err, userCreated)=>{
        if (err) {
            res.status(401).send(err);
        } else {
            console.log(userCreated);
            userCreated.password = undefined;
            res.status(200).send(userCreated);
        }
    });
}

