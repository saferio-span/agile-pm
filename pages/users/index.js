import React,{useState,useEffect} from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../contexts/UserContext'
import { actionTypes } from "../../contexts/userReducer"
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import { SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup,  InputLeftElement,Heading,ChakraProvider} from '@chakra-ui/react'
import absoluteUrl from 'next-absolute-url'
import ReactPaginate from "react-paginate"
import Avatar from 'react-avatar';
import styles from "../../styles/user.module.css"



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
    const [pageNum,setPageNum] = useState(1)
    const [pageCount,setPageCount] = useState(Math.ceil(users.length / 10))
    const [searchTerm,setSearchTerm] = useState("")

    const [filteredUser,setFilteredUser] = useState()
    const [selectedUsers,setSelectedUsers] = useState([])

    const initialCheckValue = {}
    const stateSwitch = {}

    users.forEach(user=>{
        initialCheckValue[`${user._id}_checked`] = false
        stateSwitch[`${user._id}_switch`] = false
    })

    const [checkValues,setCheckValues] = useState(initialCheckValue)

    console.log(checkValues)

    const [showGlobalButtons,setShowGlobalButtons] = useState(false)
    const [checkAllState,setCheckAllState] = useState(false)

    useEffect(()=>{
        setFilteredUser([])        

        if(searchTerm != "")
        {
            console.log(searchTerm)

            const roleIds = []
            roles.forEach(role=>{
                if(role.roleName.includes(searchTerm))
                {
                    roleIds.push(role.roleId.toString())
                }
            })
            // const roleNames= roles.map(role=>role.roleName)

            const searchResult = users.filter(user=>{
                console.log(user.userRole)
                if(user.name.includes(searchTerm) ||user.email.includes(searchTerm)||user.phone.includes(searchTerm) || roleIds.includes(user.userRole) )
                {
                    return user
                }
            })

            setFilteredUser(searchResult)
            setPageCount(Math.ceil(searchResult.length / 10))
        }
        else
        {
            if(users)
            {
                const sortedResult = users.slice((pageNum*10)-10, pageNum*10);
                setFilteredUser(sortedResult)
                setPageCount(Math.ceil(users.length / 10))
            }
        }

        const showGlobalActive = users.some((user)=>checkValues[`${user._id}_checked`] == true)

        const checkAllState = users.every((user)=>checkValues[`${user._id}_checked`] == true)
        

        // console.log('Global Active',showGlobalActive)

        setShowGlobalButtons(showGlobalActive)
        setCheckAllState(checkAllState)

        console.log(selectedUsers)
        
    },[users,pageNum,searchTerm,checkValues,selectedUsers])

    const handleDeleteUser = async (id)=>{
        //console.log(id)
        const res = await axios.post('/api/user/delete/deleteById',{
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

    const handlePageClick = (data)=>{
        setPageNum(data.selected + 1)
    }

    const handleSearchChange = (e)=>{
        console.log(e.target.value)
        setSearchTerm(e.target.value)
    }

    const handleCheckAll = (e)=>{

        if(e.target.checked)
        {
            const ckeckValue = {}
            const userIds = []

            users.forEach(user=>{
                ckeckValue[`${user._id}_checked`] = true
                userIds.push(user._id)
            })
            setCheckValues(ckeckValue)
            setSelectedUsers(userIds)
        }
        else
        {
            const ckeckValue = {}

            users.forEach(user=>{
                ckeckValue[`${user._id}_checked`] = false
            })
            setCheckValues(ckeckValue)
            setSelectedUsers([])
        }

        console.log(selectedUsers)
    }

    const handleCheckChange = async(e)=>{
        console.log(e.target.value)
        if(e.target.checked)
        {
            setCheckValues({...checkValues,[`${e.target.value}_checked`]:true})
            const userDetails =  selectedUsers.find(id=>id==e.target.value)
            console.log(userDetails)
            if(userDetails != undefined)
            {
                if(userDetails.length==0 )
                {
                    setSelectedUsers([...selectedUsers,e.target.value])
                }
            }
            else
            {
                setSelectedUsers([...selectedUsers,e.target.value])
            }
        }
        else
        {
            setCheckValues({...checkValues,[`${e.target.value}_checked`]:false})
            const userDetails =  selectedUsers.filter(id=>id!=e.target.value)
            setSelectedUsers(userDetails)
        }
    }

    const handleSelectedUsersState = async(e)=>{

        console.log(e.target.checked)
        let isActive ;
        if(e.target.checked)
        {
            isActive = true
        }
        else
        {
            isActive = false
        }

        const res = await axios.post("/api/user/states/multipleUsers",{
            ids:selectedUsers,
            isActive
        })

        if(res.status == 202)
        {
            toast(`Users state changed successfully`)
            const getFilteredUser = users.map(user=>{
                if(selectedUsers.includes(user._id))
                {
                    return {
                        ...user,
                        isActive
                    }
                }
                else
                {
                    return user
                }
            })
            setUsers(getFilteredUser)
        }
        else
        {
            toast.error("User state cannot be changed")
        }
    }

    const handleActiveState = async(id,state)=>{

        const res = await axios.post("/api/user/states/individualUser",{
            _id:id,
            isActive:state
        })

        if(res.status == 202)
        {
            toast(`User state changed successfully`)
            const updatedUsers = users.map(user=>{
                if(id==user._id)
                {
                    return{
                        ...user,
                        isActive:state
                    }
                }
                else
                {
                    return user
                }
            })
            setUsers(updatedUsers)
        }
        else
        {
            toast.error("User state cannot be changed")
        }
        
    }

    const handleDeleteMultiple = async()=>{

        const res = await axios.post("/api/user/delete/deleteMultipleUsers",{
            ids:selectedUsers
        })

        if(res.status == 200)
        {
            toast(`User deleted successfully`)
            const getFilteredUser = users.filter(user=>{
                if(!selectedUsers.includes(user._id))
                {
                    return user
                }
            })

            console.log(getFilteredUser)
            setUsers(getFilteredUser)
            setSelectedUsers([])
        }
        else
        {
            toast.error(`User cannot be deleted`)
        }
        // console.log("Delete clicked")
        // console.log(selectedUsers)
    }

  return (
    <>
        <Navbar />
        <div className='custom-body'>
            <ToastContainer />
            <div className='container-fluid'>

                    <p className='mt-3 mx-3 h5'>
                        <Link href={`/dashboard`}>Admin</Link> {`>`} <Link href={`/users`}>User</Link>
                    </p> 

                <div className='row mt-3'>
                    <ChakraProvider>
                    <div className="col-3">
                        
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input type='text' onChange={handleSearchChange} placeholder='Search Users...' />
                            </InputGroup>   
                        
                    </div>
                    </ChakraProvider>
                    <div className="col-3 d-flex justify-content-end">
                        {
                        showGlobalButtons && <div className="form-check form-switch mt-2 ">
                            <input className="form-check-input mr-1" type="checkbox" id="flexSwitchCheckDefault" onChange={handleSelectedUsersState} />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">Active / Inactive</label>
                        </div>
                        }
                        
                    </div>
                    <div className="col-3 text-end">
                        { showGlobalButtons && <button className="btn btn-outline-danger" onClick={handleDeleteMultiple} >Delete <i className="bi bi-trash"></i></button> }
                    </div>
                    <div className="col-3 text-end">
                        <Link href="/users/add">
                            <a className="btn btn-primary">Add User <i className="bi bi-person-plus-fill"></i></a>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-2 ">
                <table className="table table-responsive">
                    <thead>
                        <tr>
                            <th className='text-center'><input className="form-check-input" type="checkbox" name="selectAll" checked={checkAllState} onChange={handleCheckAll} /></th>
                            {/* <th className='text-left '><i className="bi bi-person-fill px-2"></i></th> */}
                            <th><i className="bi bi-person-fill px-2"></i> Name</th>
                            <th>Role</th>
                            <th className='text-center px-5'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            filteredUser && filteredUser.map((data,index)=>{

                                const role = roles.find(role=>{
                                    if(role.roleId==data.userRole)
                                    {
                                        return role
                                    }
                                })

                                // const userCheckValue = checkValues.filter(value=>value.id==data._id)
                                // const userCheckValue = checkValues[data._id].state
                                // console.log('userCheckValue',userCheckValue)

                                const checkValue = checkValues[`${data._id}_checked`]

                                return <>
                                <tr key={`${index}_row`} className={data.isActive ? "" : styles.tableMutedColor}>
                                    <td className='text-center'><input className="form-check-input" type="checkbox" value={data._id} id="flexCheckDefault" checked={checkValue} onChange={handleCheckChange} /></td>
                                    {/* <td className='text-left'><Avatar name={data.name} size="29" round="15px" /></td> */}
                                    <td>
                                        {
                                            data.imageUrl != "" && data.imageUrl != null ? <Avatar name={data.name} src={data.imageUrl} size="29" round="15px" />  : <Avatar name={data.name} size="29" round="15px" />
                                        }
                                        <span> {data.name}</span>
                                       </td> 
                                    <td>{role.roleName}</td>
                                    <td className='text-center'>
                                        <Link href={`/users/edit/${data._id}`}>
                                            <a className=""><i className="bi bi-pencil-fill"></i></a>
                                        </Link>

                                            <a className="mx-2 dropdown-toggle" id={`${data._id}_menuDropDown`} data-bs-toggle="dropdown" aria-expanded="false"><i className="bi bi-three-dots-vertical"></i></a>
                                            <ul className="dropdown-menu" aria-labelledby={`${data._id}_menuDropDown`}>
                                                {/* <li className='list-group-item'>
                                                    {
                                                        data.isActive && <button className="btn btn-secondary">Set as Inactive</button>
                                                    }
                                                    {
                                                        !data.isActive && <button className="btn btn-success">Set as Active</button>
                                                    }
                                                </li> */}
                                                { data.isActive && <button type="button" className="list-group-item list-group-item-action" onClick={()=>handleActiveState(data._id,false)}>Set as Inactive</button>}
                                                { !data.isActive && <button type="button" className="list-group-item list-group-item-action" onClick={()=>handleActiveState(data._id,true)}>Set as Active</button>}
                                                <li className='list-group-item' onClick={()=>{if(window.confirm("Are you sure? You want to delete this user !")){handleDeleteUser(data._id)}}}>
                                                    Delete <i className="bi bi-trash"></i>
                                                </li>
                                            </ul>
                                            
                                        {/*  */}
                                    
                                        {/* <ChakraProvider>
                                            <Menu>
                                                <MenuButton className="mx-2">
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem>
                                                        <div className="form-check form-switch mt-2 ">
                                                            <input className="form-check-input mr-1" type="checkbox" id="flexSwitchCheckDefault" checked={data.isActive} onChange={handleSelectedUsersState} />
                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{data.isActive ? "Active" : "Inactive"}</label>
                                                        </div>
                                                    </MenuItem>
                                                    <MenuItem onClick={()=>{if(window.confirm("Are you sure? You want to delete this user !")){
                                                        handleDeleteUser(data._id)
                                                    }}}>Delete <i className="bi bi-trash"></i></MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </ChakraProvider> */}
                                        
                                        {/* <button className="mx-2" onClick={()=>{if(window.confirm("Are you sure? You want to delete this user !")){
                                            handleDeleteUser(data._id)
                                        }}}><i className="bi bi-three-dots-vertical"></i></button> */}
                                    </td>
                                </tr>
                            </>
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="row">
                <div className="col offset-s4">
                    <ReactPaginate
                        previousLabel={"<"}
                        nextLabel={">"}
                        breakLabel={"..."}
                        pageCount={pageCount??0}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination justify-content-center"}
                        pageClassName={"page-item"}
                        pageLinkClassName={"page-link"}
                        previousClassName={"page-item"}
                        previousLinkClassName={"page-link"}
                        nextClassName={"page-item"}
                        nextLinkClassName={"page-link"}
                        breakClassName={"page-item"}
                        breakLinkClassName={"page-link"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        </div>
    </>
  )
}

export default UserlistPage