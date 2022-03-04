import React,{useState,useEffect} from 'react';
import Navbar from '../../components/Navbar';
import { useUserValue } from '../../contexts/UserContext'
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { FormControl,FormLabel,FormErrorMessage,Input,FormHelperText,Heading,Text,Checkbox, Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import Image from 'next/image';
import style from "../../styles/user.module.css"

const AddProject = () => {

  const [{user_details},dispatch] = useUserValue();
  //console.log('user details', user_details)

  const [values, setValues] = useState({
    projectname: '',
    description: '',
    sessionUser: ''
  })

  useEffect(() => {
    if(user_details != null || user_details != undefined){
      //console.log('InUseEffectAddProject')
      setValues({ ...values, sessionUser: user_details.name });
    }
    //console.log(values)
  }, [user_details])



  const handleInputChange = (e) =>{
      const { name, value } = e.target;
      setValues({ ...values, [name]: value });
      //console.log(values)
  }
  

  const [projectLogoSrc, setProjectLogoSrc] = useState("")
  const [logoElement, setLogoElement] = useState("")


  const handleSubmit = async (e) =>{
    e.preventDefault();

    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )
    console.log("Submit", values);

    if (hasEmptyFields) {
      toast.error('Please fill in all fields')
    }
    else{
      const availablity = await axios.post(`/api/project/findByProject`,{
        projectname: values.projectname
      })

      if(availablity.data.length > 0)
      {
          toast.error("Project name has been used already. Please try again using another Project name")
          return false
      }
      else{
          let projectLogoUrl = ""
          if(projectLogoSrc != "")
          {
              const form = e.currentTarget
              //console.log(form)
              const fileInput = logoElement
              // console.log(fileInput)

              const formData = new FormData()

              formData.append('file',fileInput.files[0])
              formData.append('upload_preset','spm-uploads')

              const res = await axios.post('https://api.cloudinary.com/v1_1/span-technology/image/upload',formData)
              const data = await res.data
              console.log("cloudinary Res" , data)
              projectLogoUrl = data.secure_url
          }
          console.log('All Data', {...values, projectLogoUrl});

          const res = await axios.post('/api/project/addProject', {...values, projectLogoUrl})
          if(res.status == 200)
          {
            toast("Project added successfully")
            setValues({
                projectname:"",
                description:"",
                sessionUser: user_details.name
            })
            setProjectLogoSrc("")
            document.getElementById("createProjectForm").reset();
          }
          else{
              toast.error("Project cannot be added")
            }
      }
    }
    //console.log(values);
  }


  const handleProjectLogo = (e) => {
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
            setProjectLogoSrc("")
            setLogoElement("")
            // console.log("Image not present")
        }        
  } 


  const resetForm = ()=>{
    document.getElementById("createProjectForm").reset();
    setValues({
      projectname:"",
      description:""
    })
  }

  const handleRemoveLogo = () => {
    setProjectLogoSrc("");
    setLogoElement("")
    document.getElementById("projectlogo").value = "";
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
                          <Link href={`/dashboard`}>Admin</Link> {`>`} <Link href={`/projects`}>Projects</Link> {`>`} Add Project
                      </div>
                      <div className="col-1">
                          <Link href="/projects">
                              <a className="btn btn-danger">Back</a>
                          </Link>
                      </div>
                  </div>
              </Heading>  
              <Box className='mt-3 mx-5'>
                <form onSubmit={handleSubmit} id="createProjectForm">
                  <Text fontSize='2xl'>Project Details</Text>
                  <FormControl>
                    <div className='mt-2'>
                        <FormLabel htmlFor='email'>Project Name <span className='text-danger'>*</span></FormLabel>
                        <Input id='projectname' name="projectname" type='text' onChange={handleInputChange} />
                    </div>
                    <div className="row ">
                      <div className="col-4 my-3">
                          <div className="mb-2">
                              <FormLabel htmlFor='projectlogo'>Upload Project logo</FormLabel>
                              <input className="form-control" type="file" name="projectlogo" id="projectlogo" onChange={handleProjectLogo} />
                          </div>
                      </div>
                      <div className={`col-2 align-center mx-5 my-4 ${style.imageContainer}`}>
                          {
                              projectLogoSrc != "" && <Image src={projectLogoSrc} width="130px" height="130px" className='' />
                          }
                      </div>
                      {projectLogoSrc && <div className='col-2'>
                           <button className="btn btn-secondary mt-5" onClick={handleRemoveLogo}>Remove Logo</button>
                        </div> }
                    </div>
                    <div className='mt-2'>
                        <FormLabel htmlFor='userName'>Project description<span className='text-danger'>*</span> </FormLabel>
                        {/* <Input id='description' name="description" type='text' onChange={handleInputChange} /> */}
                        <Textarea name="description" onChange={handleInputChange} />
                    </div>
                    <div className='my-3 d-flex justify-content-end'>
                        <button type='submit' className="btn btn-primary mx-2">Create Project</button>
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

export default AddProject