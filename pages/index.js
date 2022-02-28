import React,{useState,useEffect} from "react";
import axios from "axios"
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import { getSession,getProviders, signIn, signOut, useSession } from "next-auth/react"
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"
import Image from 'next/image'
// import { Image } from '@chakra-ui/react'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
// import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../styles/login.module.css"
import { Box,Flex,Center,Text,Button,Grid, GridItem ,Icon,Wrap, WrapItem,ChakraProvider  } from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa';


export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const providers = await getProviders()
    const session = await getSession({req})
    console.log({ 
      providers,
      session
    })
    return{
      props:{ 
        providers,
        session
      }
    }
}

export default function Home(props) {
  // const { data: session } = useSession()

  const [agileUser,setAgileUser] =  useState(false)
  const [showLogin,setShowLogin] = useState(true)
  
  const providers = props.providers
  const [values,setValues] = useState({
    email:"",
    password:""
  })
  const { data: session, status } = useSession()
  console.log(session)
  const [loading,setLoading] = useState(false)
  const [{user_details},dispatch] = useUserValue();

  const setUserDetails = async() => {
    let localEmail = localStorage.getItem("loggedInEmail");

    const res = await axios.post(`/api/user/findByEmail`,{
      email: session.user.email??localEmail
    })

    const data = await res.data
    console.log(data)
    console.log("Fetched")
    if(data.length != 0){
      setAgileUser(true)
      dispatch({
        type: actionTypes.SET_USER_DETAILS, 
        data: data[0]
      })
      Router.push('/dashboard')
    }
    else{
      console.log('User Not Found');
      setShowLogin(false)
    }
  }
 
  useEffect(()=>{
    console.log(status)
   
    if(status=="authenticated"){
      localStorage.setItem("loggedInEmail", session.user.email);
      setUserDetails()
    }

    // if(status=="authenticated" && agileUser==false){
    //   Router.push('/unauthorisedUser')
    // }

    // if(status=="authenticated" && agileUser){
    //   console.log("Go to dashboard")
    //   
    // }
    // else{
    //   Router.push('/unauthorisedUser');
    // }
    

  //eslint-disable-next-line
  },[])

  const handleTryAgain = ()=>{
    setShowLogin(true)
    signOut()

  }

  const handleValues = (e)=>{
    const { name, value } = e.target;
    setValues({...values,[name]:value})
  }
  const handleSubmit = async(e)=>{
    e.preventDefault()
    setLoading(true)
    const hasEmptyField = Object.values(values).some((element)=>element==='')
    if(hasEmptyField)
    {
      toast.error("Please fill all the fields")
    }
    else
    {
      const res = await axios.post(`/api/login`,{
        email: values.email,
        password: values.password,
      })
      const user = await res.data
      if(user.length)
      {
          localStorage.setItem('email',user[0].email)
          localStorage.setItem('name',user[0].name)
          localStorage.setItem('id',user[0]._id)
          localStorage.setItem('role',user[0].userRole)
          dispatch({
              type: actionTypes.SET_USER_DETAILS,
              data: user[0],
          })
          setLoading(false)
          Router.push({
              pathname: `/dashboard`,
          })
      }
    }
    setLoading(false)

  }

  const LoginComp = <>
   
                      
                        <Center >
                          <Button leftIcon={<FaGoogle color="red" />} size='lg' colorScheme='blue' onClick={()=>signIn(providers.google.id)} p={6}> Sign In with Google</Button>
                        </Center>
                   

    </>

  const UnauthorisedComp = <>
                          <Center >
                            <Text fontSize='3xl' color="black">Unauthorised User</Text>
                        </Center>
                        <Center >
                            <button onClick={handleTryAgain} className="btn btn-danger">
                                Try again!!
                            </button>
                        </Center>
  </>
  return (
    <ChakraProvider>
      <div className={style.loginBackground}>
        <main>
          <Box width='100%' height='100%'>
            
            <Grid templateColumns='repeat(2, 1fr)' height='100%' gap={6} pt="10%">
              <GridItem  > 
                <Center pt="10%">
                  <Text fontSize='6xl' color="#F6E05E">SPM TOOL</Text> 
                </Center>
              </GridItem>
              <GridItem>
                <Center >
                  <Box 
                    w="80%"
                    h="100%"
                    bg='white' 
                    borderWidth='1px' 
                    borderRadius='lg' >
                      <Box p='6'>
                        <Center >
                          <Image
                            src="/images/span.png"
                            alt="Login Image"
                            width={300}
                            height={200}
                            className={style.loginCardImage} />
                        </Center>
                      </Box>
                        
                        <Box p='6'>
                          {showLogin && LoginComp }
                          {!showLogin && UnauthorisedComp }
                        </Box>                      
                  </Box>
                </Center>
              </GridItem>
            </Grid>
          </Box>
        </main>
      </div>    
    </ChakraProvider>
  )
}
