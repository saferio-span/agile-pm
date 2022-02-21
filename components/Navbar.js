import React,{useEffect, useState} from 'react'
React.useLayoutEffect = React.useEffect 
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
import axios from 'axios';
import { Box } from '@chakra-ui/react';
import { 
    Flex, 
    Spacer , 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react';
import Link from 'next/link'
import { ChevronDownIcon } from '@chakra-ui/icons';
import { signOut,useSession} from "next-auth/react"

import RightDrawer from "../components/RightDrawer";
import LeftDrawer from '../components/LeftDrawer';
import Search from '../components/Search';
import { FiLogOut } from 'react-icons/fi';
import { FaUserAlt } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import styles from '../styles/nav.module.css'

const Navbar = () => {
    // const theme = useTheme();
    const [{user_details},dispatch] = useUserValue();
    const { data: session, status } = useSession()
    const router = useRouter()
    // const [drawerOpen,setDrawerOpen] = useState(false)
    const handleLogout = ()=>{
        localStorage.clear();
        
        console.log(session,`Status is ${status}`)
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        signOut()
        router.push('/')
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

        if(status=="unauthenticated")
        {
            console.log(`Inside Route`)
            router.push('/')
        }
    },[])

    return (
        <div>
          <Flex bg='#1A365D' p='2'>
            <Box p='2'>
              <LeftDrawer />
            </Box>

            <Link href="/dashboard">
                <a><AiFillHome className={styles.icons} color='#F6E05E' /></a>
            </Link>
            

            {/* <Box p='2'> */}
              {/* <Text fontSize='2xl' color='white' as='i'>Agile Management</Text> */}
              {/* <Search /> */}
            {/* </Box> */}
            <Spacer />
            <Box bg='white'>
                <Image
                    src="/images/span.png"
                    alt="Login Image"
                    width={100}
                    height={50}
                />
            </Box>
            
            <Spacer />
            <Box p='2'>
              {/* <RightDrawer /> */}
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Actions
                </MenuButton>
                <MenuList>
                    <MenuItem>Profile<Spacer /><FaUserAlt color="#319795" /></MenuItem>
                    <MenuItem onClick={handleLogout}>Logout<Spacer /><FiLogOut color="#319795" /></MenuItem>
                </MenuList>
            </Menu>
            </Box>
          </Flex>
        </div>
        
      )
};

export default Navbar;
