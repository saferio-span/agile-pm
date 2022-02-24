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
    id: projectData._id,
    projectname:projectData.projectname,
    description:projectData.description,
    updatedBy: ''
  });
  //console.log('values', values);

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
    // setValues()
    //console.log(values);
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    const hasEmptyFields = Object.values(values).some(
      (element) => element === ''
    )

    if(hasEmptyFields){
      toast.error('Please fill all the fields');
    }
    else{
      // console.log(values)
      if(values.projectname != projectData.projectname){
        const availablity = await axios.post(`/api/project/findByProject`,{
          projectname: values.projectname
        })
  
        if(availablity.data.length > 0){
          toast.error("Project name has been used already. Please try again using another Project name")
          return false
        }
      }
     
        const res = await axios.post('/api/project/editProjectById', values)
        const output = await res.data
        console.log('Output',output);

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

  return (
    <>
      <Navbar />
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
                <div className='mt-2'>
                    <FormLabel htmlFor='userName'>Project description<span className='text-danger'>*</span> </FormLabel>
                    <Input id='description' value={values.description} name="description" type='text' onChange={handleInputChange} />
                </div>
                <div className='my-3 d-flex justify-content-end'>
                    <button type='submit' className="btn btn-primary mx-2">Update Project</button>
                    <button type='reset' onClick={resetForm} className="btn btn-secondary mx-2">Cancel</button> 
                </div>
              </FormControl>
          </form>
        </Box>    
      </div>
    </>
  )
}

export default EditProject