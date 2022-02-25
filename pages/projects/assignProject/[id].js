import React from 'react';
import Navbar from '../../../components/Navbar';
import AssignProjectUserDrawer from '../../../components/AssignProjectUserDrawer';
// import { useUserValue } from '../../../contexts/UserContext'
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url';
import { FormControl,FormLabel,FormErrorMessage,Input,FormHelperText,Heading,Text,Checkbox, Box } from '@chakra-ui/react'
import { 
    Flex, 
    Spacer , 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react';


export const getServerSideProps = async (context) => {
    const {req, res, params} = context;
    const { origin } = absoluteUrl(req)
    const id = params.id

    const project = await axios.post(`${origin}/api/project/getProjectById`, {
        id
    })
    const projectData = project.data

    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data

    const userRes = await axios.get(`${origin}/api/user/getAllUsers`)
    const userData = await userRes.data

    return {
        props:{
            userData,
            roles,
            projectData
        }
    }
}

const AssignProject = ({userData, roles, projectData}) => {
  
  //console.log('Project', projectData)

  return (
    <>
      <Navbar />
      <ToastContainer />
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className="col-3 offset-9 d-flex justify-content-end">
                    <AssignProjectUserDrawer members={userData} roles={roles} projectId={projectData._id}/>
                </div>
            </div>
        </div>

        <div className='container'>
            <h2>{projectData.projectname}</h2>
        </div>
    </>
  )
}

export default AssignProject