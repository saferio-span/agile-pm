import React,{useState,useEffect} from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../../contexts/UserContext'
import { actionTypes } from "../../../contexts/userReducer"
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import Select from 'react-select'
import Image from 'next/image';
import { FormControl,FormLabel,FormErrorMessage,Input,FormHelperText,Heading,Text,Checkbox, Box,ChakraProvider } from '@chakra-ui/react'
import style from "../../../styles/user.module.css"

export const getServerSideProps = async (context)=>{
    const { req, query, params } = context;
    const { origin } = absoluteUrl(req)
    const id = params.id;

    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data

    const userRes = await axios.post(`${origin}/api/user/getById`,{
        id
    })
    const userData = await userRes.data

    return{
      props:{ 
        userData,
        roles
      }
    }
}

const Edit = ({userData, roles}) => {

    // console.log(userData);
    // console.log(roles);

    const userEmail = userData.email;
    const [user, setUser] = useState(userData);
    const [name,setname] = useState("")
    console.log(user)
    const [loading,setLoading] = useState(false)
    const [imageSrc,setImageSrc] = useState(userData.imageUrl)
    const [imageUploaded,setImageUploaded] = useState(false)
    const rolesOptions = roles.map(role=>{
        return { key: role.roleId, value: role.roleId.toString(), label: role.roleName }
    })
    

    const handleSubmit = async(e)=>{
        e.preventDefault()
        console.log('Submit', user)
        const hasEmptyField = Object.values(user).some((element)=>element==='')
        if(hasEmptyField) 
        {
            toast.error("Please fill in all fields which are mandatory(*)")
            return false
        }
        else
        {
            if(userEmail != user.email){
                const availablity = await axios.post(`/api/user/findByEmail`,{
                    email: user.email
                })
        
                if(availablity.data.length > 0)
                {
                    toast.error("Email has been used already. Please try again using another email")
                    setLoading(false)
                    return false
                }
            }

            let imageUrl = user.imageUrl
            if(imageSrc != "")
            {
                const form = e.currentTarget
                const fileInput = Array.from(form.elements).find(({name})=>name==='profile')
                console.log(fileInput)
                const formData = new FormData()
                formData.append('file',fileInput.files[0])
                formData.append('upload_preset','spm-uploads')
                const res = await axios.post('https://api.cloudinary.com/v1_1/span-technology/image/upload',formData)
                const data = await res.data
                imageUrl=data.secure_url
            }
            
            const res = await axios.post('/api/user/editById',{...user,imageUrl})
            if(res.status == 200)
            {
                toast("User Updated successfully")
            }

            if(res.status != 200)
            {
                toast.error("User cannot be updated")
            }
            
        }
    }

    const handleRoleSelectChange = (e)=>{
        // console.log(e.value);
        if(e !== null)
        {
            setUser({ ...user, userRole: e.value });
        }
        else{
            setUser({ ...user, userRole: "" });
        }
        // console.log(user)
    }


    const handleInputChange = (e)=>{
        const { name, value } = e.target;
		
        if(name == "globalAccess")
        {
            setUser({ ...user, [name]: e.target.checked });
        }
        else
        {
            setUser({ ...user, [name]: value });
        }
        // console.log(user)
    }

    const handleSelectedState = (e)=>{
        console.log(e.target)
    }

    const resetForm = ()=>{
        document.getElementById("updateUserForm").reset();
        document.getElementById("globalAccess").checked=false;
        setUser({
            email:"",
            name:"",
            mobile:"",
            globalAccess : true,
            role:""
        })
    }

    const handleProfilePic = (e)=>{
        if(e.target.value!="")
        {
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0])
            reader.onload = function(onLoadEvent) {
                setImageSrc(onLoadEvent.target.result)
            };
            setImageUploaded(true)
        }
        else
        {
            setImageSrc(user.imageUrl)
            setImageUploaded(false)
            // console.log("Image not present")
        }        
    }

  return (
    <>
        <Navbar />
        <div className='custom-body'>
            <ToastContainer />
            <ChakraProvider>
                <div>
                    <Heading as='h3' size='md' className='mt-3 mx-3'>
                        <Link href={`/dashboard`}>Admin</Link> {`>`} <Link href={`/users`}>User</Link> {`>`} Edit User
                    </Heading>  
                    <Box className='mt-3 mx-5'>

                        
                        <form onSubmit={handleSubmit} id="updateUserForm">
                            <Text fontSize='2xl'>User Details</Text>
                            <FormControl>
                                <div className='mt-2'>
                                    <FormLabel htmlFor='email'>Email address <span className='text-danger'>*</span></FormLabel>
                                    <Input id='email' name="email" type='email' value={user.email} onChange={handleInputChange} />
                                </div>
                                <div className='mt-2'>
                                    <FormLabel htmlFor='userName'>User Name<span className='text-danger'>*</span> (Full Name of the employee)</FormLabel>
                                    <Input id='name' name="name" type='text' value={user.name} onChange={handleInputChange} />
                                </div>
                                <div className='mt-2'>
                                    <FormLabel htmlFor='email'>Mobile Number<span className='text-danger'>*</span></FormLabel>
                                    <Input id='mobileNumber' name="mobile" value={user.phone} type='text' maxLength="10" minLength="10" onChange={handleInputChange} />
                                </div>
                                <div className="row ">
                                    <div className="col-4 my-5">
                                        <div className="mb-3">
                                            <FormLabel htmlFor='profile'>Upload Photo</FormLabel>
                                            <input className="form-control" type="file" name="profile" id="profile" onChange={handleProfilePic} />
                                        </div>
                                    </div>
                                    <div className={`col-2 align-center mx-5 my-4 ${style.imageContainer}`}>
                                        {
                                            imageSrc != "" && imageSrc != null && <Image src={imageSrc} width="130px" height="130px" className='' />
                                        }
                                    </div>
                                </div>

                                <Text fontSize='2xl' className='mt-3'>Scope</Text>

                                <div className='mt-2'>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input"type="checkbox" defaultChecked={user.globalAccess} name='globalAccess' id="globalAccess" onChange={handleInputChange} />
                                        <label className="form-check-label" htmlFor="flexCheckDefault">
                                            Global Accesss
                                        </label>
                                    </div>
                                </div>

                                <div className='mt-2'>
                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked={user.isActive} onChange={handleSelectedState} />
                                    </div>
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
                                        value = {
                                            rolesOptions.filter(option =>
                                            option.value === user.userRole)
                                        }
                                    />
                                </div>
                                <div className='my-3 d-flex justify-content-end'>
                                <button type='submit' className="btn btn-primary mx-2">Update User</button>
                                <button type='reset' onClick={resetForm} className="btn btn-secondary mx-2">Cancel</button> 
                                </div>
                            </FormControl>
                        </form>
                    </Box>     
                </div>
            </ChakraProvider>
        </div>
    </>
  )
}

export default Edit