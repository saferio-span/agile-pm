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


// const previlage = [
//     { value: '', label: 'Select...' },
//     { value: 'admin', label: 'Admin' },
//     { value: 'developer', label: 'Developer' },
//     { value: 'tester', label: 'Tester' },
//   ];

// const users = [
//     { value: '', label: 'Select...' },
//     { value: 'bharath', label: 'Bharath' },
//     { value: 'johnsaferio', label: 'John Saferio' },
//     { value: 'rexiya', label: 'Rexiya Britto' },
//     { value: 'shakthi', label: 'Shakthi' },
//     { value: 'govind', label: 'Govind' },
//     { value: 'sruthi', label: 'Sruthi' },
//     { value: 'ravi', label: 'Ravi' },
//     { value: 'vinu', label: 'Vinu' },
//     { value: 'anu', label: 'Anu' },
//     { value: 'harish', label: 'Harish' },
//     { value: 'mahesh', label: 'Mahesh' },
//     { value: 'ram', label: 'Ram' },
//     { value: 'naga', label: 'Naga' },
//     { value: 'shyam', label: 'Shyam' },
//     { value: 'prasad', label: 'Prasad' },
//     { value: 'savio', label: 'Savio' },
//     { value: 'robert', label: 'Robert' },
//   ];

const animatedComponents = makeAnimated();


const AssignProjectUserDrawer = (props) => {

    //console.log('Props', props);
    
    const [{user_details},dispatch] = useUserValue();

    const rolesOptions = props.roles.map(role =>{
      return { key: role.roleId, value: role.roleId.toString(), label: role.roleName }
    })

    const membersDefaultList = props.members.map(user =>{
      return { key: user._id, value: user._id, label: user.name }
    })

    const [selectedRoleOption, setSelectedRoleOption] = useState(null);
    //console.log('Role', selectedRoleOption);

    const [rolesBasedUsers, setRolesBasedUsers] = useState(membersDefaultList);
    //console.log('Role Based Users', rolesBasedUsers);

    const [selectedMembers, setSelectedMembers] = useState(null);
    console.log('Members', selectedMembers);
    

    useEffect(() => {
      if(selectedRoleOption != null){
        const Users = props.members.filter((user) => user.userRole == selectedRoleOption.value )
        const List = Users.map(user =>{
          return { key: user._id, value: user._id, label: user.name }
        })
        setRolesBasedUsers(List)
      }
      else{
        setRolesBasedUsers(membersDefaultList)
      }
    }, [selectedRoleOption])


    useEffect(() => {
    }, [selectedMembers])
    

    const handleAssign = async () => {
        //e.preventDefault();
        if(selectedMembers != null){
          const arrayUsers = Object.values(selectedMembers);
          const userIds = arrayUsers.map(user => {
            return {
              id: user.value,
              addedBy: user_details.name}
            }
          )
          
          const res = await axios.post('/api/project/assignProject', {
            projectId: props.projectId,
            userIds
          })

          if(res.status == 200){
            toast("Project assigned added successfully")
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
                        defaultValue={selectedRoleOption}
                        onChange={setSelectedRoleOption}
                        options={rolesOptions}
                        isClearable={true}
                    />
                </div>
                <div className='my-4'>
                    <FormLabel htmlFor='email'>Choose Members<span className='text-danger'>*</span></FormLabel>
                    <Select
                        closeMenuOnSelect={false}
                        components={animatedComponents}
                        onChange={setSelectedMembers}
                        isMulti
                        options={rolesBasedUsers}
                    />
                </div>
                <div className='mx-4'>
                  <List spacing={3}>
                    {selectedMembers && selectedMembers.map((data, index) =>{
                        return <ListItem>
                        <HStack spacing='20px'>
                          <Box w='50px' h='40px'>
                            <Avatar name={data.label} size="50" round="25px" />
                          </Box>
                          <Box w='200px' h='40px' className='mt-3'>
                            {data.label}
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