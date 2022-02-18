import React,{useState,useEffect} from "react";
import axios from "axios"
import { toast,ToastContainer } from "react-toastify"
import Router from 'next/router'
import { getSession,getProviders, signIn,useSession } from "next-auth/react"
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link"
import Image from 'next/image'
// import { Image } from '@chakra-ui/react'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
// import "bootstrap-icons/font/bootstrap-icons.css";
import style from "../styles/login.module.css"
import { Box,Flex,Center,Text,Button,Grid, GridItem ,Icon,Wrap, WrapItem  } from '@chakra-ui/react'
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

  const providers = props.providers
  const [values,setValues] = useState({
    email:"",
    password:""
  })
  const { data: session, status } = useSession()
  
  const [loading,setLoading] = useState(false)
  const [{user_details},dispatch] = useUserValue();

  useEffect(()=>{
    console.log(status)
    // if(session == null )
    // {
    //     signOut()
    // }
    
    if(status=="authenticated"){
        Router.push('/dashboard')
    }
  //eslint-disable-next-line
  },[])

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
  return (
    <div className={style.loginBackground}>
      <main>
        <ToastContainer />
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
                        <Center >
                          <Button leftIcon={<FaGoogle color="red" />} size='lg' colorScheme='blue' onClick={()=>signIn(providers.google.id)} p={6}><i className="bi bi-google text-danger"></i> Sign In with Google</Button>
                        </Center>
                      </Box>                      
                </Box>
              </Center>
            </GridItem>
          </Grid>
        </Box>
        
        {/* <div className="container-fluid">
          <ToastContainer />
          <div className={`${style.loginCols} row`}>
            <div className="col-md-6 d-flex justify-content-center">
              <h1 className="text-warning align-self-center display-1">SPM TOOL</h1>
            </div>
            <div className="col-md-6 d-flex justify-content-center">
                <div className={`${style.loginCard} card px-5 py-3 align-self-center`}>
                  <div className={`${style.imageCard} card-header align-self-center`}>
                    <Image
                        src="/images/span.png"
                        alt="Login Image"
                        width={250}
                        height={200}
                        className={style.loginCardImage} />
                  </div>
                  <div className="card-body align-self-center">
                      <button type="button" onClick={()=>signIn(providers.google.id)} className="btn btn-block btn-lg btn-primary px-5"><i className="bi bi-google text-danger"></i> Sign In with Google</button>
                  </div>
                </div>
            </div>
            
          </div>
        </div> */}
      </main>
    </div>    
  )
}
