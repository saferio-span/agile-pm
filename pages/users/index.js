import React,{useState,useEffect} from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'

export const getServerSideProps = async (context)=>{
    const { req,query } = context;
    const { origin } = absoluteUrl(req)
  
    const usersRes = await axios.get(`${origin}/api/user/getAllUsers`)
    const users = await usersRes.data

    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data
    console.log(roles)
    console.log(users)
    return{
      props:{ 
        users,
        roles
      }
    }
}

const UserlistPage = (props) => {
    const [users,setUsers] = useState(props.users)
    const [roles,setRoles] = useState(props.roles)
    const [{user_details},dispatch] = useUserValue();

    useEffect(()=>{
    },[users])

    const handleDeleteUser = async (id)=>{
        //console.log(id)
        const res = await axios.post('/api/user/deleteById',{
            id
        })

        if(res.status == 200){
            const updatedUsers = users.filter(user => user._id != id)
            setUsers(updatedUsers)
            //console.log(updatedUsers);
            toast('User deleted successfully');
        }
        else{
            toast('User cannot be deleted');
        }
    }

  return (
    <>
        <Navbar />
        <ToastContainer />
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className="col-2 offset-10 d-flex justify-content-end">
                    <Link href="/users/add">
                        <a className="btn btn-primary">Add User <i className="bi bi-person-plus-fill"></i></a>
                    </Link>
                </div>
            </div>
        </div>

        <div className="mx-2 my-2 ">
            <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th className='text-center px-5'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users && users.map((data,index)=>{

                            const role = roles.find(role=>{
                                if(role.roleId==data.userRole)
                                {
                                    return role
                                }
                            })

                            return <>
                            <tr key={`${index}_row`}>
                                <td>{index+1}</td>
                                <td>{data.name}</td>
                                <td>{role.roleName}</td>
                                <td className='text-center'>
                                    <Link href={`/users/edit/${data._id}`}>
                                        <a className="btn btn-primary">Edit <i className="bi bi-pencil-square"></i></a>
                                    </Link>
                                    <button className="btn btn-danger mx-1" onClick={()=>{if(window.confirm("Are you sure? You want to delete this user !")){
                                        handleDeleteUser(data._id)
                                    }}}>Delete <i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        </>
                        })
                    }
                </tbody>
            </table>
        </div>
    </>
  )
}

export default UserlistPage