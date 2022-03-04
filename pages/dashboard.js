import React from 'react';
import Router from 'next/router'
import { useUserValue } from '../contexts/UserContext'
import { actionTypes } from "../contexts/userReducer"
import Navbar from '../components/Navbar';
import { Text,Button,Grid,GridItem,Heading } from '@chakra-ui/react'
import { useSession } from "next-auth/react"
import { toast,ToastContainer } from "react-toastify"
import styles from "../styles/dashboard.module.css"
import Link from 'next/link';
import { AiFillFolderOpen } from 'react-icons/ai';
import { IoIosPeople, IoMdPersonAdd } from 'react-icons/io';
import { FaTasks } from 'react-icons/fa';
import { RiDashboardFill, RiGitRepositoryFill } from 'react-icons/ri';
import { BsFillGearFill } from 'react-icons/bs';


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
        <div className={`custom-body ${styles.dashboardBackground}`} >
            <ToastContainer />
            <div className="container-fluid px-5">
                <div className="row">
                    
                    {/* Left Section */}

                    <div className={`col-10 mt-3`}>
                        <div className="row my-2">
                            <div className="col-12">
                                <p className='h3'>Recommended tasks</p>  
                            </div>    
                        </div>
                        <div className="row my-2">
                            <div className="col-12">
                                <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                                    <div className="row">
                                        <div className="col-4">
                                            <p className='h4'>Sign up/Sign in</p>    
                                        </div>
                                        <div className="col-1 offset-5 text-center text-danger">
                                            <p className='h4'>17 Feb</p>         
                                        </div>
                                        <div className="col-2 text-warning">
                                            <p className='h4'>In Progress</p>
                                        </div>
                                        <div className="col-1 text-warning">
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>    
                        </div>
                        <div className="row my-2">
                            <div className="col-12">
                                <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                                    <div className="row">
                                        <div className="col-4">
                                            <p className='h4'>Google Signup with Oauth</p>    
                                        </div>
                                        <div className="col-1 offset-5 text-center text-danger">
                                            <p className='h4'>17 Feb</p>         
                                        </div>
                                        <div className="col-2 text-warning">
                                            <p className='h4'>In Progress</p>
                                        </div>
                                        <div className="col-1 text-warning">
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>    
                        </div>
                        <div className="row my-2">
                            <div className="col-12">
                                <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                                    <div className="row">
                                        <div className="col-4">
                                            <p className='h4'>Facebook Signup</p>    
                                        </div>
                                        <div className="col-1 offset-5 text-center text-danger">
                                            <p className='h4'>17 Feb</p>         
                                        </div>
                                        <div className="col-2 text-warning">
                                            <p className='h4'>In Progress</p>
                                        </div>
                                        <div className="col-1 text-warning">
                                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    </div>                                    
                                </div>
                            </div>    
                        </div>
                        <div className="row mt-2">
                            <div className="col-12">
                                <p className='h3'>Projects</p>  
                            </div>    
                        </div>
                        <div className="row my-3">
                            <div className="col-4 pr-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                                {/* <i className={`bi bi-folder-fill text-info ${styles.cardIcon}`}></i> */}
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>TaxBandits 2.0</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 px-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>TaxBandits E-file</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Ravi Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 pl-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>Truck Logics</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                            <div className="col-4 pr-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>123 Paystubs</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 px-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>TaxBandits 2.0</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Express TrucTax</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 pl-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>Express Extension</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>    
                            <div className="col-4 pr-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>Express E-file</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 px-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>TaxBandits 94x Series</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 pl-2 my-2">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-2 text-center">
                                                <AiFillFolderOpen className={`text-center mt-2 ${styles.cardIcon}`} />
                                            </div>
                                            <div className="col-10">
                                                <p className='h3'>TaxBandits Span Control</p>
                                                <p><IoIosPeople className={`text-warning h5 ${styles.peopleIcon}`} /> <span className='text-secondary px-2'>Prasad Team</span></p>
                                                <p><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Raguvaran</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Deepan</span><span className={`badge text-secondary mx-1 ${styles.badgeBg}`}>Androse Vijay</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Left Section Ends */}

                    {/* Right Section Starts */}

                    <div className="col-2">
                        <div className="row">
                            <div className="col-12">
                                <div className="row mt-3">
                                    <div className="col">
                                        <p className='h3'>Tasks</p>
                                    </div>
                                </div>
                                <div className="row py-1 my-2">
                                    <div className="col-1 text-primary">
                                        <FaTasks className={`lead my-1 ${styles.iconBlueBg}`} />
                                    </div>
                                    <div className="col-10">
                                        <p className="lead">My Tasks</p>
                                    </div>
                                </div>
                                <div className="row py-1 my-2">
                                    <div className="col-1 text-primary">
                                        <FaTasks className={`lead my-1 ${styles.iconBlueBg}`} />
                                    </div>
                                    <div className="col-10">
                                        <p className="lead">Task Created by me</p>
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className="col-1 text-primary">
                                        <FaTasks className={`lead my-1 ${styles.iconBlueBg}`} />
                                    </div>
                                    <div className="col-10">
                                        <p className="lead">Starred Tasks</p>
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    <div className="col">
                                        <p className='h3'>General</p>
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className="col-1 text-primary">
                                        <RiDashboardFill className={`lead ${styles.iconBlueBg} my-1`} />
                                    </div>
                                    <div className="col-10">
                                        <Link href={`/dashboard`}>
                                            <a className="lead">Dashboard</a>
                                        </Link>
                                    </div>
                                </div>                  
                                <div className="row py-1">
                                    <div className="col-1 text-primary">
                                        <IoMdPersonAdd className={`lead ${styles.iconBlueBg} my-1`} />
                                        <i className={`bi bi-person-plus-fill lead ${styles.iconBlueBg}`}></i>
                                    </div>
                                    <div className="col-10">
                                        <p>
                                            <Link href={`/users/add`}>
                                                <a className="lead">Add users</a>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className="col-1 text-primary">
                                        <RiGitRepositoryFill className={`lead ${styles.iconBlueBg} my-1`} />
                                    </div>
                                    <div className="col-10">
                                        <p className="lead">Reports</p>
                                    </div>
                                </div>
                                <div className="row py-1">
                                    <div className="col-1 text-primary">
                                        <BsFillGearFill className={`lead ${styles.iconBlueBg} my-1`} />
                                    </div>
                                    <div className="col-10">
                                        <p>
                                            <Link href={`/settings`}>
                                                <a className="lead">Settings</a>
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </div> 
    </>;
};

export default Dashboard;
