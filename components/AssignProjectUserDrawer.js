import React, {useState} from 'react'
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
import { Button, ButtonGroup } from '@chakra-ui/react';
import { Input, FormLabel } from '@chakra-ui/react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


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
//   ];

const animatedComponents = makeAnimated();


const AssignProjectUserDrawer = (props) => {

    // console.log('Props', props);
    
    const rolesOptions = props.roles.map(role =>{
        return { key: role.roleId, value: role.roleId, label: role.roleName }
    })

    const users = props.members.map(user=>{
        return { key: user._id, value: user._id, label: user.name }
    })


    const [selectedRoleOption, setSelectedRoleOption] = useState(null);
    console.log('Role', selectedRoleOption);

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
                <div className='mt-2'>
                    <FormLabel htmlFor='email'>Choose Role<span className='text-danger'>*</span></FormLabel>
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
                        isMulti
                        options={users}
                    />
                </div>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='blue'>Assign</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
}

export default AssignProjectUserDrawer