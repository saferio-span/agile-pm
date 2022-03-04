import React,{useState,useEffect} from 'react';
import Navbar from '../../../components/Navbar';
import { useUserValue } from '../../../contexts/UserContext'
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url';
import { FormControl,FormLabel,FormErrorMessage,Input,FormHelperText,Heading,Text,Checkbox, Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import Image from 'next/image';
import style from "../../../styles/user.module.css"

export const getServerSideProps = async (context) => {
    const {req,res,params} = context
    const {origin} = absoluteUrl(req)
    const id = params.id

    const project = await axios.post(`${origin}/api/project/getProjectById`, {
        id
    })
    const projectData = project.data
    //console.log(projectData);

    return{
        props:{
          projectData
        }
    }
}


const EditProject = ({projectData}) => {

  //console.log('Edit Project', projectData)

  const [{user_details},dispatch] = useUserValue();
  //console.log('user details', user_details)

  const [user, setUser] = useState(user_details)

  const [values, setValues] = useState({
    projectname: projectData.projectname,
    description: projectData.description
  });
  console.log('values', values);

  useEffect(() => {
      if(user_details != undefined || user_details != null){
        setValues({
          ...values,
          updatedBy: user_details.name
        })
      }
  }, [user])

  
  const handleInputChange = (e) => {
    const {name, value} = e.target
    //console.log(name, value)
    setValues({...values, [name]:value})
    //console.log(values);
  }
  

  const [projectLogoSrc, setProjectLogoSrc] = useState(projectData.logoSrc)
  const [logoElement, setLogoElement] = useState("")


  const handleSubmit = async(e) => {
    e.preventDefault();

    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )
    
    console.log("Submit", values);

    if(hasEmptyFields){
      toast.error('Please fill all the fields');
    }
    else{
      //console.log('In Val', values)
      if(values.projectname != projectData.projectname){
        const availablity = await axios.post(`/api/project/findByProject`,{
          projectname: values.projectname
        })
  
        if(availablity.data.length > 0){
          toast.error("Project name has been used already. Please try again using another Project name")
          return false
        }
      }


      let logoSrc = projectLogoSrc;
      // console.log('logoSrc', logoSrc)

      if(logoElement != "")
      {
          // console.log('In');
          const form = e.currentTarget
          const fileInput = logoElement
          const formData = new FormData()
          formData.append('file',fileInput.files[0])
          formData.append('upload_preset','spm-uploads')

          const res = await axios.post('https://api.cloudinary.com/v1_1/span-technology/image/upload',formData)
          const data = await res.data
          console.log("cloudinary Res" , data)
          logoSrc = data.secure_url
      }
      console.log('All Data', {...values, logoSrc});
     
      const res = await axios.post('/api/project/editProjectById', {...values, logoSrc, id: projectData._id})
      const output = await res.data
      // console.log('Output',output);

      if(res.status == 200)
      {
        toast("Project updated successfully")
      }

      if(res.status != 200)
      {
        toast.error("Project cannot be updated")
      }
    }

  }
  
  const resetForm = () => {
      document.getElementById('editProjectForm').reset()
      setValues({
        projectname: '',
        description: '',
        sessionUser: ''
      })
  }


  const handleEditLogo = (e) => {
    console.log(e.target);
    if(e.target.value!="")
        {
          let reader = new FileReader();
          reader.readAsDataURL(e.target.files[0])
          reader.onload = function(onLoadEvent) {
              setProjectLogoSrc(onLoadEvent.target.result)
          };
          setLogoElement(e.target)
          // console.log("Image present")
        }
        else
        {
            setProjectLogoSrc(values.logoSrc)
            setLogoElement("")
            // console.log("Image not present")
        }       
  }


  const handleRemoveLogo = () => {
    setProjectLogoSrc("");
    //document.getElementById("editprojectlogo").value = "";
  }

  return (
    <>
      <Navbar />
      <div className='custom-body'>
        <ChakraProvider>
          <ToastContainer />
            <div>
              <Heading as='h3' size='md' className='mt-3 mx-3'>
                  <div className="row">
                      <div className="col-11">
                          <Link href={`/dashboard`}>Admin</Link> {`>`} <Link href={`/projects`}>Projects</Link> {`>`} Edit Project
                      </div>
                      <div className="col-1">
                          <Link href="/projects">
                              <a className="btn btn-danger">Back</a>
                          </Link>
                      </div>
                  </div>
              </Heading>  
              <Box className='mt-3 mx-5'>
                <form onSubmit={handleSubmit} id="editProjectForm">
                  <Text fontSize='2xl'>Project Details</Text>
                  <FormControl>
                    <div className='mt-2'>
                        <FormLabel htmlFor='email'>Project Name <span className='text-danger'>*</span></FormLabel>
                        <Input id='projectname' value={values.projectname} name="projectname" type='text' onChange={handleInputChange} />
                    </div>
                    <div className="row ">
                        <div className="col-4 my-3">
                            <div className="mb-2">
                                <FormLabel htmlFor='profile'>Upload Photo</FormLabel>
                                <input className="form-control" type="file" name="logoSrc" id="editprojectlogo" onChange={handleEditLogo} />
                            </div>
                        </div>
                        <div className={`col-2 align-center mx-5 my-4 ${style.imageContainer}`}>
                            {
                                projectLogoSrc != "" && projectLogoSrc != null && <Image src={projectLogoSrc} width="130px" height="130px" className='' />
                            }
                        </div>
                        {projectLogoSrc && <div className='col-2'>
                           <button className="btn btn-secondary mt-5" onClick={handleRemoveLogo}>Remove Logo</button>
                        </div> }
                    </div>
                    <div className='mt-2'>
                        <FormLabel htmlFor='userName'>Project description<span className='text-danger'>*</span> </FormLabel>
                        {/* <Input id='description' value={values.description} name="description" type='text' onChange={handleInputChange} /> */}
                        <Textarea name="description" value={values.description} onChange={handleInputChange}  placeholder='Project Description'
                        size='sm'/>
                    </div>
                    <div className='my-3 d-flex justify-content-end'>
                        <button type='submit' className="btn btn-primary mx-2">Update Project</button>
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

export default EditProject