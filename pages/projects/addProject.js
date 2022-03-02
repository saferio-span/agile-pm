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
  
  const handleSubmit = async (e) =>{
    e.preventDefault();

    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )
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
        const res = await axios.post('/api/project/addProject', values)
            if(res.status == 200)
            {
              toast("Project added successfully")
              setValues({
                  projectname:"",
                  description:"",
                  sessionUser: user_details.name
              })
              document.getElementById("createProjectForm").reset();
            }

            if(res.status != 200)
            {
              toast.error("Project cannot be added")
            }
      }
    }

    //console.log(values);
  }

  const resetForm = ()=>{
    document.getElementById("createProjectForm").reset();
    setValues({
      projectname:"",
      description:""
    })
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