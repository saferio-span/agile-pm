import React from 'react';
import Router from 'next/router'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
import Navbar from '../components/Navbar';
import { Text } from '@chakra-ui/react'

const Dashboard = () => {

    const [{user_details},dispatch] = useUserValue();
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
        <Text fontSize='6xl' color="#F6E05E">Dashboard</Text>   
    </>;
};

export default Dashboard;
