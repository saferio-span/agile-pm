import React, {useEffect, useState} from 'react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';
import { Button, ButtonGroup, Box } from '@chakra-ui/react';
import { Input, FormLabel, List, ListIcon, ListItem } from '@chakra-ui/react';
import Select from 'react-select';
import axios from 'axios';
import makeAnimated from 'react-select/animated';
import Avatar from 'react-avatar';
import { HStack } from '@chakra-ui/react'
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { useUserValue } from '../contexts/UserContext'
import router from 'next/router';

const animatedComponents = makeAnimated();

const AssignProjectUserDrawer = ({assignedUsers,roles,members,updateHandler,projectId}) => {

    // console.log('User Props', assignedUsers);
  
    let childAssignedUsers = assignedUsers

    let selectedUsers = []

    if(childAssignedUsers.length != 0){
      const userData = []
      childAssignedUsers.forEach((asssignedUser) => {
        members.forEach(user =>{
          if(user._id == asssignedUser._id){
            selectedUsers.push({ key: user._id, value: user._id, label: user.name })
          }
        })
      })
      // selectedUsers=userData
    }

    const [{user_details},dispatch] = useUserValue();

    const rolesOptions = roles.map(role =>{
      return { key: role.roleId, value: role.roleId.toString(), label: role.roleName }
    })

    const membersDefaultList = members.map(user =>{
      return { key: user._id, value: user._id, label: user.name }
    })

    //const [Users, setUsers] = useState(membersDefaultList);
    let users = membersDefaultList
    

    const handleRoleOption = (e) => {
      if(e == null){
        // setUsers(membersDefaultList)
        users=membersDefaultList
      }
      else{
        const Users = members.filter((user) => user.userRole == e.value )
        const list = Users.map(user =>{
          return { key: user._id, value: user._id, label: user.name }
        })
        //setUsers(list)
        users=list
      }
    }
    
    const childMembers = childAssignedUsers.map(user =>{
      return { key: user._id, value: user._id, label: user.name }
    })


    const handleSelectMembers = (e) => {
      if(e == null){
        selectedUsers=[]
      }
      else{
        selectedUsers = e
        const updatedUsers = []
        e.forEach(selected=>{
          members.forEach(user =>{
            if(user._id == selected.value){
              updatedUsers.push(user)
            }
          })
        })
        childAssignedUsers = updatedUsers
      }
    }

    const handleAssign = async () => {
        let userIds = [];
        if(selectedUsers != null){
          const userIds = selectedUsers.map(user => {
            return {
              id: user.value,
              addedBy: user_details.name}
            }
          )

            const res = await axios.post('/api/project/assignProject', {
              projectId: projectId,
              userIds
            })

            if(res.status == 200){
              toast("Project assigned successfully")
              userIds.map((user) => {
                updatedIdList.push(user.id)
              })
              const upatedUsers = members.filter((user) => updatedIdList.includes(user._id));
              updateHandler(upatedUsers);
            }
            else{
              toast("Project cannot be assigned")
            }
          }
        else{
          toast.error('Please select the members')
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
  
    return (
      <>
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
              {/* <form onSubmit={handleSubmit}> */}
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
                        defaultValue={childMembers}
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        onChange={handleSelectMembers}
                        isMulti
                        options={users}
                    />
                </div>
                <div className='mx-4'>
                  <List spacing={3}>
                    {childAssignedUsers && childAssignedUsers.map((data, index) =>{

                        return <ListItem>
                        <HStack spacing='20px'>
                          <Box w='50px' h='40px'>
                            <Avatar name={data.name} size="50" round="25px" />
                          </Box>
                          <Box w='200px' h='40px' className='mt-3'>
                            {data.name}
                          </Box>
                        </HStack>
                      </ListItem>
                    })}
                  </List>
                </div>
              {/* </form> */}
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAssign} colorScheme='blue'>Assign</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
}

export default AssignProjectUserDrawer