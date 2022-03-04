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
import style from '../../../styles/project.module.css'
import ReactPaginate from "react-paginate"


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
    else{
        dbAssignedUserData = []
    }
    

    let defaultPageCount
    if(dbAssignedUsers.length != 0){
        if(dbAssignedUsers[0].users.length > 0){
            defaultPageCount = Math.ceil(dbAssignedUsers[0].users.length / 2)
        }
        else{
            defaultPageCount = 1
        }
    }
    else{
        defaultPageCount = 1
    }
    

    const [pageNum,setPageNum] = useState(1)
    const [pageCount,setPageCount] = useState(defaultPageCount)
    const [searchTerm,setSearchTerm] = useState("")

    const [members, setMembers] = useState(membersDefaultList)
    const [userList, setUserList] = useState(assignedUsers);
    const [userTableList, setUserTableList] = useState(dbAssignedUserData); 
    const [tableList, setTableList] = useState([]);
    const [defaultDbList, setDefaultDbList] = useState(assignedUsers);


    useEffect(() => {
        if(searchTerm != ""){
            const searchResult = userTableList.filter(user=>{
                if(user.name.includes(searchTerm))
                {
                    return user
                }
            })
            setTableList(searchResult);
            setPageCount(Math.ceil(searchResult.length / 2))
        }
        else{
            let list = userTableList.slice((pageNum*2)-2, pageNum*2);
            setTableList(list);
            setPageCount(Math.ceil(userTableList.length / 2))
        }

        // userList.forEach((user) => {
        //    tableList.forEach(() => {

        //    })
        //     document.getElementById(`user_${user._id}`).checked = false
        // })


    }, [searchTerm, pageNum, userTableList])



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
        let drawerList = [];

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
                //console.log('upatedUsers', upatedUsers)
                if(upatedUsers.length != 0){
                    drawerList = upatedUsers.map((user) => {
                        return {key: user._id, value: user._id, label: user.name}
                    })
                }
                //console.log('drawerList',drawerList)

                let upatedTableList = upatedUsers;
                setUserTableList(upatedTableList);
                setUserList(drawerList);
                setDefaultDbList(drawerList);
                console.log("Page Count",Math.ceil(upatedUsers.length / 2))
                setPageCount(Math.ceil(upatedUsers.length / 2))
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
        // console.log('Delete Member', id);
        //console.log('List', userList);

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

        const updateProjectMember = await axios.post('/api/project/assignProject', {
            userIds: updatedUserIds,
            projectId: projectData._id,
        });

        if(updateProjectMember.status == 200){
            let listArray = [];
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
            setDefaultDbList(updatedDrawerList);
            toast('User deleted succesfully');
        }
        else{
            toast.error('User cannot be deleted');
        }
    }



    const toggleCheckbox = (e) => {
        // var checkboxes = document.getElementsByName('individualSelectMember');
        // for (var i = 0; i < checkboxes.length; i++) {
        //     if (checkboxes[i] != e.target){
        //         checkboxes[i].checked = e.target.checked; 
        //     }     
        // }
        tableList.forEach((user) => {
            document.getElementById(`user_${user._id}`).checked = e.target.checked
        })
    }



    const handleIndividualcheckbox = (e) => {
        console.log('Individual Check', e.target.value);

        if(e.target.checked == false){
            document.getElementById("bulkSelectMember").checked = false;
        }
        // else{
        //     // tableList.forEach((user) => {
        //     //     document.getElementById(`user_${user._id}`).checked = e.target.checked
        //     // })
        //     var checkboxes = document.getElementsByName('individualSelectMember');
        //     for (var i = 0; i < checkboxes.length; i++) {
        //         if (checkboxes[i].checked){
        //             document.getElementById("bulkSelectMember").checked = true;
        //         }     
        //     }
        // }
    }


    const handleBulkDelete = async () => {
        // console.log('Bulk Delete')
        
        let onlySelectedUser = [];
        let bulkuser = [];
        let updatedListArray = [];
        let updatedUserIds ;

        var checkboxes = document.getElementsByName('individualSelectMember');
        if(document.getElementById("bulkSelectMember").checked){
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked){
                    bulkuser.push(checkboxes[i].value)
                }
            } 
            console.log('Bulk Delete Checked', bulkuser);

            // bulkuser.forEach((id) => {
            //     userList.forEach((user) => {
            //         if(user.value != id){
            //             updatedListArray.push({
            //                 id: user.value,
            //                 addedBy: user_details.name
            //             })
            //         }
            //     })
            // })
           
            // updatedUserIds = []
            // console.log('Bulk Member No', bulkuser)
        }
        else{
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked){
                    onlySelectedUser.push(checkboxes[i].value)
                }
            } 
            console.log('Only Selected Member', onlySelectedUser)

            onlySelectedUser.forEach((id) => {
                userList.forEach((user) => {
                    if(user.value != id){
                        updatedListArray.push({
                            id: user.value,
                            addedBy: user_details.name
                        })
                    }
                })
            })
           
            // updatedUserIds = updatedListArray
            console.log('Remaining members', updatedListArray)
        }

        if(bulkuser.length == 0 && onlySelectedUser == 0){
            toast.error('Please select the members to delete')
        }
        // else{
        //     const updateProjectMember = await axios.post('/api/project/assignProject', {
        //         userIds: updatedUserIds,
        //         projectId: projectData._id,
        //     });
    
        //     if(updateProjectMember.status == 200){
        //         let listArray = [];
        //         let updatedDrawerList;
        //         const listIds = updatedUserIds.forEach((data) => {
        //             listArray.push(data.id)
        //         })
            
        //         const upatedListUsers = userData.filter((user) => listArray.includes(user._id));
        //         if(upatedListUsers.length != 0){
        //             updatedDrawerList = upatedListUsers.map((user) => {
        //                 return {key: user._id, value: user._id, label: user.name}
        //             })
        //         }
        //         setUserTableList(upatedListUsers);
        //         setUserList(updatedDrawerList);
        //         setDefaultDbList(updatedDrawerList);
        //         toast('User deleted succesfully');
        //     }
        //     else{
        //         toast.error('User cannot be deleted');
        //     }
        // } 
    }


    const handlePageClick = (data) => {
        //console.log('handlePageClick', data.selected)
        setPageNum(data.selected + 1)
        // document.getElementById("bulkSelectMember").checked = false
        // document.getElementsByClassName('individualSelectMember').checked = false
    }

    
    const handleSearch = (e) => {
        //console.log('handleSearch', e.target.value)
        setSearchTerm(e.target.value);
    }



    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

  return (
    <>
      <Navbar />
        <div className='custom-body'>
        <ChakraProvider>
            <ToastContainer />
                <div className='container-fluid'>
                    <div className='row mt-3'>
                        <div className="col-4 offset-3 d-flex justify-content-end">
                            <Text fontSize='2xl'>{projectData.projectname}</Text>
                        </div>
                    </div>
                </div>
                <div className='container-fluid'>
                    <div className='row mt-3'>
                        <div className="col-3">
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input type='text' onChange={handleSearch} placeholder='Search Users...' />
                            </InputGroup>
                        </div>
                        <div className='col-3 offset-3'>
                            <button className="btn btn-outline-danger" id="bulkDeleteAssignedMembers" onClick={handleBulkDelete}>Dlelete <i className="bi bi-trash"></i></button>
                        </div>
                        <div className="col-3 d-flex justify-content-end">
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
                                            defaultValue={defaultDbList}
                                            closeMenuOnSelect={false}
                                            components={animatedComponents}
                                            onChange={handleSelectedMembers}
                                            isMulti
                                            options={members}
                                        />
                                    </div>
                                    <div className={`${style.scroller} mx-4`} >
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

                <div className="mx-2 my-2 mt-3">
                    <table className="table table-hover table-striped table-responsive">
                        <thead>
                            <tr>
                                <th><input className="form-check-input" type="checkbox" name='bulkSelectMember' id="bulkSelectMember" onChange={toggleCheckbox} /></th>
                                <th>Name</th>
                                <th>Job Title</th>
                                <th className='text-center px-5'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableList && tableList.map((user, index) => {
                                const role = roles.find((role) => user.userRole == role.roleId)

                                return <>
                                    <tr key={`userProjectTable${index}`}>
                                        <td>
                                            <div className='mt-3'>
                                                <input className="form-check-input individualSelectMember" type="checkbox" name='individualSelectMember' id={`user_${user._id}`} value={user._id} onChange={handleIndividualcheckbox} />
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

                <div className="row">
                    <div className="col offset-s4">
                        <ReactPaginate
                            previousLabel={"<<"}
                            nextLabel={">>"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination justify-content-center"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>
            </ChakraProvider>
        </div>
    </>
  )
}

export default AssignProject