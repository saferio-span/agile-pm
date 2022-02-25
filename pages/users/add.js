import React,{useState,useEffect} from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import Select from 'react-select'
import { FormControl,FormLabel,FormErrorMessage,Input,FormHelperText,Heading,Text,Checkbox, Box } from '@chakra-ui/react'

export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const { origin } = absoluteUrl(req)

    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data
    return{
      props:{ 
        roles
      }
    }
}

const Add = (props) => {

    // const [loading,setLoading] = useState(false)
    const rolesOptions = props.roles.map(role=>{
        return { key: role.roleId, value: role.roleId, label: role.roleName }
    })
    const [userDetails,setUserDetails] = useState({
        email:"",
        name:"",
        mobile:"",
        globalAccess : false,
        role:""
    })


    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log(userDetails)
        const hasEmptyField = Object.values(userDetails).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields which are mandatory(*)")
            return false
        }
        else
        {
            const availablity = await axios.post(`/api/user/findByEmail`,{
                email: userDetails.email
            })
    
            if(availablity.data.length > 0)
            {
                toast.error("Email has been used already. Please try again using another email")
                return false
            }
            else
            {

                const res = await axios.post('/api/signUp',userDetails)
                if(res.status == 200)
                {
                    toast("User registered successfully")
                    setUserDetails({
                        email:"",
                        name:"",
                        mobile:"",
                        globalAccess : false,
                        role:""
                    })
                    document.getElementById("createUserForm").reset();
                }
    
                if(res.status != 200)
                {
                    toast.error("User cannot be added")
                }
            }
        }
    }

    const handleRoleSelectChange = (e)=>{
        if(e !== null)
        {
            setUserDetails({ ...userDetails, role: e.value });
        }
        else{
            setUserDetails({ ...userDetails, role: "" });
        }
        // console.log(userDetails)
    }


    const handleInputChange = (e)=>{
        const { name, value } = e.target;
		
        if(name == "globalAccess")
        {
            setUserDetails({ ...userDetails, [name]: e.target.checked });
        }
        else
        {
            setUserDetails({ ...userDetails, [name]: value });
        }
        //console.log(userDetails)
    }

    const resetForm = ()=>{
        document.getElementById("createUserForm").reset();
        document.getElementById("globalAccess").checked=false;
        setUserDetails({
            email:"",
            name:"",
            mobile:"",
            globalAccess : true,
            role:""
        })
    }

  return (
    <>
        <Navbar />
        <ToastContainer />
        <div>
            <Heading as='h3' size='md' className='mt-3 mx-3'>
                <div className="row">
                    <div className="col-11">
                        <Link href={`/dashboard`}>Admin</Link> {`>`} <Link href={`/users`}>User</Link> {`>`} Add User
                    </div>
                    <div className="col-1">
                        <Link href="/users">
                            <a className="btn btn-danger">Back</a>
                        </Link>
                    </div>
                </div>
            </Heading>  
            <Box className='mt-3 mx-5'>

                
                <form onSubmit={handleSubmit} id="createUserForm">
                    <Text fontSize='2xl'>User Details</Text>
                    <FormControl>
                        <div className='mt-2'>
                            <FormLabel htmlFor='email'>Email address <span className='text-danger'>*</span></FormLabel>
                            <Input id='email' name="email" type='email' onChange={handleInputChange} />
                        </div>
                        <div className='mt-2'>
                            <FormLabel htmlFor='userName'>User Name<span className='text-danger'>*</span> (Full Name of the employee)</FormLabel>
                            <Input id='name' name="name" type='text' onChange={handleInputChange} />
                        </div>
                        <div className='mt-2'>
                            <FormLabel htmlFor='email'>Mobile Number<span className='text-danger'>*</span></FormLabel>
                            <Input id='mobileNumber' name="mobile" type='number' maxLength="10" minLength="10" onChange={handleInputChange} />
                        </div>

                        <Text fontSize='2xl' className='mt-3'>Scope</Text>

                        <div className='mt-2'>
                            <Checkbox name='globalAccess' id="globalAccess" onChange={handleInputChange}>Global Access</Checkbox>
                        </div>

                        <div className='mt-2'>
                            <FormLabel htmlFor='email'>Choose Job Title<span className='text-danger'>*</span></FormLabel>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue="0"
                                isSearchable="true"
                                isClearable="true"
                                name="role"
                                options={rolesOptions}
                                onChange={handleRoleSelectChange}
                                inputProps={{ id: 'role' }}
                            />
                        </div>
                        <div className='my-3 d-flex justify-content-end'>
                           <button type='submit' className="btn btn-primary mx-2">Create User</button>
                           <button type='reset' onClick={resetForm} className="btn btn-secondary mx-2">Cancel</button> 
                        </div>
                    </FormControl>
                </form>
            </Box>  
                
            </div>
    </>
  )
}

export default Add