import React,{useEffect, useState} from 'react'
React.useLayoutEffect = React.useEffect 
import Image from 'next/image'
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
import Router from 'next/router'

const Navbar = () => {

    const [url,setUrl] =  useState("")
    // const theme = useTheme();
    const [{user_details},dispatch] = useUserValue();
    const { data: session, status } = useSession()
    const [url,setUrl] = useState("")
    // console.log(Router)
    // const router = useRouter()
    // const [drawerOpen,setDrawerOpen] = useState(false)
    console.log(url)
    const handleLogout = ()=>{
        localStorage.clear();
        
        console.log(session,`Status is ${status}`)
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        signOut({ callbackUrl: url })
        // Router.push('/')

    }
    const setUserDetails = async() => {
        let localEmail = localStorage.getItem("loggedInEmail");

        const res = await axios.post(`/api/user/findByEmail`,{
            email: session?.user?.email??localEmail
        })
    
        const data = await res.data
        //console.log(data)
        console.log("Fetched")
        if(data){
          dispatch({
            type: actionTypes.SET_USER_DETAILS, 
            data: data[0]
          })
        }
      }

    useEffect(()=>{
      fetchdata()
      
        if(user_details == undefined || user_details == null)
        {
            setUserDetails()
        }
        setUrl(window.location.origin)
        if(status=="unauthenticated")
        {
            console.log(`Inside Route`)
            router.push('/')
        }
        

        // if(status=="unauthenticated")
        // {
        //     console.log(`Inside Route`)
        //     Router.push('/')
        // }
        console.log(window.location)
        setUrl(window.location.origin)
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
