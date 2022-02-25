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

export const getServerSideProps = async (context) => {
    const {req, res, params} = context;
    const { origin } = absoluteUrl(req)

    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data

    const userRes = await axios.get(`${origin}/api/user/getAllUsers`)
    const userData = await userRes.data

    return {
        props:{
            userData,
            roles
        }
    }
}

const AssignProject = ({userData, roles}) => {
  
//   console.log('Roles', roles)

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className='container-fluid'>
            <div className='row mt-3'>
                <div className="col-3 offset-9 d-flex justify-content-end">
                    <AssignProjectUserDrawer members={userData} roles={roles} />
                </div>
            </div>
        </div>

        <div className="mx-2 my-2 ">
            <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Project Members</th>
                        <th className='text-center px-5'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr >
                        <td></td>
                        <td></td>
                        <td></td>
                        <td className='text-center'>
                            <Link href='/'>
                                <a className="btn btn-primary">Edit <i className="bi bi-pencil-square"></i></a>
                            </Link>
                            <button className="btn btn-danger mx-1" onClick={()=>{if(window.confirm("Are you sure? You want to delete this project !")){
                                //handleDeleteProject()
                            }}}>Delete <i className="bi bi-trash"></i></button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
  )
}

export default AssignProject