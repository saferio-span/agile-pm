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
  
    const rolesRes = await axios.get(`${origin}/api/role/getAllRoles`)
    const roles = await rolesRes.data
    console.log(roles)
    return{
      props:{ 
        roles
      }
    }
  }

const Roles = (props) => {

    const [role,setRole] = useState("")

    const [roles,setRoles] = useState(props.roles)
    const [{user_details},dispatch] = useUserValue();

    

    const handleAddRole =async (e)=>{
        e.preventDefault()
        // console.log({
        //     name:role,
        //     createdBy:user_details ? user_details.name : ""
        // });
        const res = await axios.post("/api/role/create",{
            name:role,
            createdBy:user_details ? user_details.name : ""
        })

        const result = await res.data

        // console.log(result);
        if(res.status == 200)
        {     
            setRoles([...roles,result])
            setRole("")
            toast("Role added successfully")
        }
        else
        {
            toast.error("Role is not created")
        }
    }
    
    const handleRoleName = (e)=>{
        setRole(e.target.value)
    }

    const handleEditRole = async(id)=>{
        const res = await axios.post("/api/role/update",{
            id,
            name:role
        })
        if(res.status==200)
        {
            toast("Role updated successfully")
            const updatedRoles = roles.map(data=>{
                if(data._id==id)
                {
                    return {
                        ...data,
                        roleName:role
                    }
                }
                else
                {
                    return data
                }
            })
            setRoles(updatedRoles)
        }
        else
        {
            toast.error('Role cannot be updated')
        }
    }

    const handleDeleteRole = async (id)=>{
        const res = await axios.post("/api/role/delete",{
            id
        })
        if(res.status == 200)
        {
            toast("Role deleted successfully")
            const excludedRoles = roles.filter(role=>role._id!==id)
            setRoles(excludedRoles)
        }
        else
        {
            toast.error("Role connot be deleted")
        }

    }

  return <>
    <Navbar />
    <ToastContainer />
    <div className='container-fluid'>
        <div className='row mt-3'>
            <div className="col-1 offset-11">
                {/* <Link href="/roles/add">
                    <a className="btn btn-primary">Add <i className="bi bi-plus-circle"></i></a>
                </Link> */}
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addRole"> 
                    Add <i className="bi bi-plus-circle"></i>
                </button>
            </div>
        </div>
    </div>

    <div className="mx-2 my-2 ">
        <table className="table table-hover table-striped table-responsive">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th className='text-center px-5'>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    roles && roles.map((data,index)=>(<>
                        <tr key={`${index}_row`}>
                            <td>{index+1}</td>
                            <td>{data.roleName}</td>
                            <td className='text-center'>
                                <button className="btn btn-primary mx-1" data-bs-toggle="modal" data-bs-target={`#editRole${data._id}`}>Edit <i className="bi bi-pencil-square"></i></button>
                                <button className="btn btn-danger mx-1" onClick={()=>{if(window.confirm("Are you sure? You want to delete this role !")){
                                    handleDeleteRole(data._id)
                                }}}>Delete <i className="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    </>))
                }
            </tbody>
        </table>
    </div>

    <div className="modal fade" id="addRole" tabIndex="-1" aria-labelledby="addRoleLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="addRoleLabel">Add Role</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddRole}>
            <div className="modal-body">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" name="name" placeholder="Role Name" value={role} onChange={handleRoleName} />
                </div>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Add Role</button>
            </div>
            </form>
            </div>
        </div>
    </div>

    {
        roles && roles.map((data,index)=>(<>
            <div className="modal fade" id={`editRole${data._id}`} tabIndex={index} aria-labelledby="editRoleLabel" key={`editRole${data._id}`} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="editRoleLabel">Edit Role</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                
                    <div className="modal-body">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" className="form-control" name={`${data.roleId}_name`} id={`${data.roleId}_name`} placeholder="Role Name" defaultValue={data.roleName} onChange={handleRoleName} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={()=>handleEditRole(data._id)}>Edit Role</button>
                    </div>
                    </div>
                </div>
            </div>
        </>))
    }
  </>
};

export default Roles;
