import React, {useEffect, useState} from 'react';
import Navbar from '../../../components/Navbar';
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
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Input, InputGroup,  InputLeftElement,FormHelperText,Heading,Text,Checkbox,Box,Button, ButtonGroup, FormLabel, List, ListIcon, ListItem } from '@chakra-ui/react'
import {Flex, Spacer, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton} from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'
import Router from 'next/router'

const animatedComponents = makeAnimated();

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
    const dbAssignedUsers = projectUsers.data


    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`);
    const roles = await rolesRes.data;
    // console.log('Entire Roles', roles);


    const userRes = await axios.get(`${origin}/api/user/getAllUsers`)
    const userData = await userRes.data
    // console.log('Entire User Data', userData)

    return {
        props:{
            roles,
            userData,
            projectData,
            dbAssignedUsers
        }
    }
}



const AssignProject = ({roles, userData, projectData, dbAssignedUsers}) => {

    //console.log('dbAssignedUsers', dbAssignedUsers);

    const [{user_details},dispatch] = useUserValue();

    const rolesOptions = roles.map(role =>{
        return { key: role.roleId, value: role.roleId.toString(), label: role.roleName }
    })

    const membersDefaultList = userData.map(user =>{
        return { key: user._id, value: user._id, label: user.name }
    })

    let dbAssignedUserIds = [];
    let dbAssignedUserData = null;
    let assignedUsers = null;
    if(dbAssignedUsers.length != 0){
        dbAssignedUsers[0].users.forEach((user) => {
            dbAssignedUserIds.push(user.id)
        })
        dbAssignedUserData = userData.filter((user) => dbAssignedUserIds.includes(user._id))

        
        if(dbAssignedUserData.length != 0){
            assignedUsers = dbAssignedUserData.map((user) => {
                return {key: user._id, value: user._id, label: user.name}
            })
        }
    }
    //console.log('dbAssignedUserData', dbAssignedUserData);
    

    const [members, setMembers] = useState(membersDefaultList)
    const [userList, setUserList] = useState(assignedUsers);
    const [userTableList, setUserTableList] = useState(dbAssignedUserData); 
    // const [defaultDbList, setDefaultDbList]


    const handleRoleOption = (e) => {
        // console.log('Handle Role', e.value);
        if(e == null){
            setMembers(membersDefaultList);
        }else{
            const roleBasedMembers = userData.filter((user) => user.userRole == e.value)
            const roleBasedMemberList = roleBasedMembers.map(user => {
                return {key: user._id, value: user._id, label:user.name}
            })
            setMembers(roleBasedMemberList);
            //console.log('roleBasedMemberList', roleBasedMemberList)
        } 
    }


     const handleSelectedMembers = (e) => {
        // console.log('Handle Selected Members', e)
        if(e == null){
            setUserList(null)
        }
        else{
            setUserList(e)
        }
     }


     const handleAssign = async () => {
        let userIds = [];
        let updatedIdList = [];
        // let updatedUserIds;

        if(userList != null){
            // console.log('Handle Assign', userList)
            userList.map((user) => {
                userIds.push({
                    id: user.value,
                    addedBy: user_details.name
                })
            })

            const projectId = projectData._id;
            // console.log('Handle Assign', userIds)

            const res = await axios.post('/api/project/assignProject', {
                projectId: projectId,
                userIds
            })

            if(res.status == 200){
                toast("Project assigned successfully")
                userIds.map((user) => {
                    updatedIdList.push(user.id)
                  })
                const upatedUsers = userData.filter((user) => updatedIdList.includes(user._id));
                setUserTableList(upatedUsers);
                //console.log('upatedUsers', upatedUsers)
                console.log('Table List', userTableList)
              }
              else{
                toast("Project cannot be assigned")
              }
        }
        else{
            toast.error('Please select members')
        }
    }

    const handleDeleteProjectMember = async (id) => {
        console.log('Delete Member', id);
        console.log('List', userList);

        let updatedListArray = [];
        let updatedUserIds ;

        let list = userList.forEach((user) => {
            if(user.value != id){
                updatedListArray.push({
                    id: user.value,
                    addedBy: user_details.name
                })
            }
        })
        updatedUserIds = updatedListArray
        const proId = projectData.projectId
        //console.log("UpdatedList", updatedListArray);

        const updateProjectMember = await axios.post('/api/project/assignProject', {
            userIds: updatedUserIds,
            projectId: projectData._id,
        });

        if(updateProjectMember.status == 200){
            let listArray = [];
            let listIdArray = [];
            let updatedDrawerList;
            const listIds = updatedUserIds.forEach((data) => {
                listArray.push(data.id)
            })
        
            const upatedListUsers = userData.filter((user) => listArray.includes(user._id));
            if(upatedListUsers.length != 0){
                updatedDrawerList = upatedListUsers.map((user) => {
                    return {key: user._id, value: user._id, label: user.name}
                })
            }
            setUserTableList(upatedListUsers);
            setUserList(updatedDrawerList);
            console.log('Updated List', upatedListUsers)
            toast('User deleted succesfully');
        }
        else{
            toast.error('User cannot be deleted');
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

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
                    {/* <AssignProjectUserDrawer members={userData} roles={roles} updateHandler={updatedUserArray} assignedUsers={userList} projectId={projectData._id}/> */}
                    {/* <ChildContainer members={userData} roles={roles} updateHandler={updatedUserArray} assignedUsers={userList} projectId={projectData._id} /> */}
                    <Button ref={btnRef}  onClick={onOpen} colorScheme='blue'>
                        <a>Assign Project Member <i className="bi bi-person-plus-fill"></i></a>
                    </Button>
                    <Drawer
                        isOpen={isOpen}
                        placement='right'
                        onClose={onClose}
                        finalFocusRef={btnRef}
                        size='lg'
                    >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Assign members to projects</DrawerHeader>
            
                        <DrawerBody>
                            <div className='mt-2'>
                                <FormLabel htmlFor='email'>Choose Role</FormLabel>
                                <Select
                                    onChange={handleRoleOption}
                                    options={rolesOptions}
                                    isClearable={true}
                                />
                            </div>
                            <div className='my-4'>
                                <FormLabel htmlFor='email'>Choose Members<span className='text-danger'>*</span></FormLabel>
                                <Select
                                    defaultValue={assignedUsers}
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    onChange={handleSelectedMembers}
                                    isMulti
                                    options={members}
                                />
                            </div>
                            <div className='mx-4'>
                                {userList && userList.map((user, index) => {
                                    return <>
                                        <List spacing={3} key={`${index}_row`}>
                                            <ListItem>
                                                <HStack spacing='20px'>
                                                <Box w='50px' h='40px'>
                                                    <Avatar name={user.label} size="50" round="25px" />
                                                </Box>
                                                <Box w='200px' h='40px' className='mt-3'>
                                                    {user.label}
                                                </Box>
                                                </HStack>
                                            </ListItem>
                                        </List>
                                    </>
                                })}
                            </div>
                        </DrawerBody>
            
                        <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleAssign} colorScheme='blue'>Assign</Button>
                        </DrawerFooter>
                    </DrawerContent>
                    </Drawer>
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
                    {userTableList && userTableList.map((user, index) => {
                        const role = roles.find((role) => user.userRole == role.roleId)

                        return <>
                            <tr key={`userProjectTable${index}`}>
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
                                <td>
                                    <p className='mt-3'>
                                        {role.roleName}
                                    </p>
                                </td>
                                <td className='text-center'>
                                    <button className='mt-3' onClick={()=>{if(window.confirm("Are you sure? You want to remove the user(s) from this project !")){
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