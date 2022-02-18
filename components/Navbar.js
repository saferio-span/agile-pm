import React,{useEffect, useState} from 'react'
// import Drawer from 'rc-drawer';
import Router from 'next/router'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
import Link from "next/link";
import axios from 'axios';
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
import { Input } from '@chakra-ui/react';

const Navbar = () => {
    // const theme = useTheme();
    const [{user_details},dispatch] = useUserValue();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    // const [drawerOpen,setDrawerOpen] = useState(false)
    const handleLogout = ()=>{
        localStorage.clear();
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        Router.push('/')
    }

    const fetchdata = async ()=>{
        var id = localStorage.getItem('id')
        const userRes = await axios.post(`/api/user/getById`,{
            id
        })
        const details = userRes.data

        console.log(details)

        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: details,
        })
    }

    useEffect(()=>{
        fetchdata()
    },[])
    
  

    return (
        <>
            <Button ref={btnRef} colorScheme='teal' onClick={onOpen} mr='2'>
            Create an Account?
            </Button>
            <Drawer
            isOpen={isOpen}
            placement='right'
            onClose={onClose}
            finalFocusRef={btnRef}
            >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Create your account</DrawerHeader>
    
                <DrawerBody>
                <Input placeholder='Type here...' />
                </DrawerBody>
    
                <DrawerFooter>
                <Button variant='outline' mr={3} onClick={onClose}>
                    Cancel
                </Button>
                <Button colorScheme='blue'>Save</Button>
                </DrawerFooter>
            </DrawerContent>
            </Drawer>
        </>
    )
};

export default Navbar;
