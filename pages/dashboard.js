import React from 'react';
import Router from 'next/router'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
import Navbar from '../components/Navbar';
import { Text,Button,Grid,GridItem,Heading } from '@chakra-ui/react'
import { useSession } from "next-auth/react"

const Dashboard = () => {

    const [{user_details},dispatch] = useUserValue();
    const { data: session, status } = useSession()
    console.log(session);
    
    const handleLogout = ()=>{
        localStorage.clear();
        dispatch({
            type: actionTypes.SET_USER_DETAILS,
            data: null,
        })
        Router.push('/')
    }

    return <>
        <Navbar />  
        <div className="container-fluid">
            <Heading as='h2' size='2xl' className='mt-3'>
                Welcome to SPM
            </Heading>
            {/* <div className='row'>
                <div className="col-12">
                    <div className='row'>
                        <div className="col-10"><Text fontSize='4xl'>Roles</Text></div>
                        <div className="col-2 mt-2"><button className="btn btn-primary">Add Roles</button></div>
                    </div>
                    <div className='row'>
                        <div className="col-10"><Text fontSize='4xl'>Users</Text></div>
                        <div className="col-2 mt-2"><button className="btn btn-success">Add Users</button></div>
                    </div>
                </div>
            </div> */}
            {/* <ul className="list-group mt-3">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Roles
                    <button className="btn btn-primary">Add Roles</button>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                    Users
                    <button className="btn btn-success">Add Users</button>
                </li>
            </ul> */}
        </div>        
    </>;
};

export default Dashboard;
