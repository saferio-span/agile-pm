import connectDB from "../../config/connectDB";
import User from "../../models/userModel"
import bcrypt from 'bcrypt';
connectDB()

export async function comparePassword(password,hashPassword)
{
    // console.log(`bcrypt function password`)
    // console.log(password,hashPassword)
    const validity = bcrypt.compareSync(password, hashPassword);
    return validity
}

export default async function handler(req,res)
{
    const {email,password} = req.body    

    await User.find({
        email: email
    }, (err, user)=>{
      if (err){
        console.log(err)
        return res.status(401).send('User not found. Please Sign in.');
      }
      else
      {
        console.log(user)
        if(!user.length)
        {
            return res.status(401).send('User not found');  
        }
        else
        {
            // console.log(`Bycrypt Status `)
            comparePassword(password,user[0].password).then(function(result) {
                if(result)
                {
                    res.send(user) 
                }
                else
                {
                    return res.status(401).send('Authentication failed. Invalid user or password.');
                }
            });
        }
      }     
    }).clone().catch(function(err){ console.log(err)})
}

