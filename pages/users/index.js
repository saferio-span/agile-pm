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
import ReactPaginate from "react-paginate"
import Avatar from 'react-avatar';
import { 
    Flex, 
    Spacer , 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    ChakraProvider
} from '@chakra-ui/react';



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

    const [filteretdUser,setFilteredUser] = useState()
    const [checkAll,setCheckAll] = useState(false)
    const [selectedUsers,setSelectedUsers] = useState([])

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
        
    },[users,pageNum,searchTerm,checkAll])

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
            setCheckAll(true)
        }
        else{
            setCheckAll(false)
        }
    }

    const handleCheckChange = (e)=>{

        if(e.target.checked)
        {
            setSelectedUsers([...selectedUsers,e.target.value])
        }
        else
        {
            const filteredUsers = selectedUsers.filter(user=>user._id != e.target.value)
            setSelectedUsers(filteredUsers)
            setCheckAll(false)
        }
    }



  return (
    <>
        <Navbar />
        <ToastContainer />
        <div className='container-fluid'>
            <div className='row mt-2'>
                <div className="col-3">
                <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1"><i className="bi bi-search"></i></span>
                    <input type="text" className="form-control" placeholder="Search" onChange={handleSearchChange} />
                </div>
                </div>
                <div className="col-9 text-end">
                    <Link href="/users/add">
                        <a className="btn btn-primary">Add User <i className="bi bi-person-plus-fill"></i></a>
                    </Link>
                </div>
            </div>
        </div>

        <div className="mx-2 ">
            <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                        <th className='text-center'><input class="form-check-input" type="checkbox" name="selectAll" onChange={handleCheckAll} /></th>
                        <th className='text-left '><i className="bi bi-person-fill px-2"></i></th>
                        <th>Name</th>
                        <th>Role</th>
                        <th className='text-center px-5'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteretdUser && filteretdUser.map((data,index)=>{

                            const role = roles.find(role=>{
                                if(role.roleId==data.userRole)
                                {
                                    return role
                                }
                            })

                            const checkedValue = checkAll == true ? "true" : "";

                            return <>
                            <tr key={`${index}_row`}>
                                <td className='text-center'><input class="form-check-input" type="checkbox" value={data._id} id="flexCheckDefault" checked={checkedValue} onChange={handleCheckChange} /></td>
                                <td className='text-left'><Avatar name={data.name} size="29" round="15px" /></td>
                                <td>{data.name}</td>
                                <td>{role.roleName}</td>
                                <td className='text-center'>
                                    <Link href={`/users/edit/${data._id}`}>
                                        <a className=""><i className="bi bi-pencil-fill"></i></a>
                                    </Link>
                                    <ChakraProvider>
                                        <Menu>
                                            <MenuButton className="mx-2">
                                                <i className="bi bi-three-dots-vertical"></i>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem>Active</MenuItem>
                                                <MenuItem>Inactive</MenuItem>
                                                <MenuItem onClick={()=>{if(window.confirm("Are you sure? You want to delete this user !")){
                                                    handleDeleteUser(data._id)
                                                }}}>Delete <i className="bi bi-trash"></i></MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </ChakraProvider>
                                    
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
    </>
  )
}

export default UserlistPage