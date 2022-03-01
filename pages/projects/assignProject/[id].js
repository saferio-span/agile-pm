import React, {useEffect, useState} from 'react';
import Navbar from '../../../components/Navbar';
import AssignProjectUserDrawer from '../../../components/AssignProjectUserDrawer';
import { SearchIcon } from '@chakra-ui/icons';
import { useUserValue } from '../../../contexts/UserContext'
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url';
import Avatar from 'react-avatar';
import { HStack } from '@chakra-ui/react'
import { Input, InputGroup,  InputLeftElement,FormHelperText,Heading,Text,Checkbox,Box } from '@chakra-ui/react'
import { 
    Flex, 
    Spacer , 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import Router from 'next/router'

export const getServerSideProps = async (context) => {
    const {req, res, params} = context;
    const { origin } = absoluteUrl(req)
    const id = params.id

    const project = await axios.post(`${origin}/api/project/getProjectById`, {
        id
    })
    const projectData = project.data


    const projectUsers = await axios.post(`${origin}/api/project/getProjectUsersById`, {
        id
    })
    const assignedUsers = projectUsers.data


    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data


    const userRes = await axios.get(`${origin}/api/user/getAllUsers`)
    const userData = await userRes.data

    return {
        props:{
            userData,
            roles,
            projectData,
            assignedUsers
        }
    }
}

const AssignProject = ({userData, roles, projectData, assignedUsers}) => {
  
    //console.log('Assigned users', assignedUsers)

    let users = [];
    if(assignedUsers.length != 0){
        const getAssignedUsers = assignedUsers[0].users.map(user =>{
            return user.id
        })
    
        users = userData.filter((user) => getAssignedUsers.includes(user._id) )
    }
    
    const [userList,setUserList] = useState(users);


    const [{user_details},dispatch] = useUserValue();


    const updatedUserArray = (usersArray) => {
        setUserList(usersArray)
    }

    const handleDeleteProjectMember = async (id) => {
        const updatedUsers = userList.filter((user) => {
            if(user._id != id){
                return user._id
            }
        })

        let updatedUserIds = [];
        const addedBy = user_details.name;
        updatedUsers.forEach(function(element) {
            updatedUserIds.push({
                id: element._id,
                addedBy: addedBy
            })
        })

        const proId = projectData._id
        
        const deleteProjectMember = await axios.post('/api/project/assignProject', {
            userIds:updatedUserIds,
            projectId:proId,
        });

        if(deleteProjectMember.status == 200){
            setUserList(updatedUsers);
            // Router.reload()
            toast('User deleted succesfully');
        }
        else{
            toast.error('User cannot be deleted');
        }
    }



    useEffect(()=>{
        // console.log("User List from useEffect",userList)
    },[userList])


  return (
    <>
      <ChakraProvider>
      <Navbar />
      <ToastContainer />
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className="col-3">
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents='none'
                            children={<SearchIcon color='gray.300' />}
                        />
                        <Input type='tel' placeholder='Search Users...' />
                    </InputGroup>
                </div>
                <div className="col-3 offset-6 d-flex justify-content-end">
                    <AssignProjectUserDrawer members={userData} roles={roles} updateHandler={updatedUserArray} assignedUsers={userList} projectId={projectData._id}/>
                    {/* <ChildContainer members={userData} roles={roles} updateHandler={updatedUserArray} assignedUsers={userList} projectId={projectData._id} /> */}
                </div>
            </div>
        </div>

        <div className="mx-2 my-2 ">
            <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Job Title</th>
                        <th className='text-center px-5'></th>
                    </tr>
                </thead>
                <tbody>
                    {userList.map((user, index) => {
                        const role = roles.find(role => role.roleId == user.userRole)
                        return  <>
                                    <tr key={`${index}_row`}>
                                        <td>
                                            <div className='mt-4'>
                                                <Checkbox name='ProjectAccess' id="ProjectAccess"></Checkbox>
                                            </div>
                                        </td>
                                        <td>
                                            <HStack spacing='20px'>
                                                <Box w='50px' h='40px'>
                                                    <Avatar name={user.name} size="40" round="25px" />
                                                </Box>
                                                <Box w='200px' h='40px' className='mt-3'>
                                                    <p>{user.name}</p>
                                                </Box>
                                            </HStack>
                                        </td>
                                        <td><p className='mt-3'>{role.roleName}</p></td>
                                        <td className='text-center'>
                                            <button className='mt-3' onClick={()=>{if(window.confirm("Are you sure? You want to delete this member !")){
                                                    handleDeleteProjectMember(user._id)
                                                }}}> <i className="bi bi-trash"></i></button>
                                        </td>
                                    </tr>
                                </>
                    })}
                </tbody>
            </table>
        </div>
        </ChakraProvider>
    </>
  )
}

export default AssignProject