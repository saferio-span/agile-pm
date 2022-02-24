import React,{ useState,useEffect} from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../contexts/UserContext'
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'


export const getServerSideProps = async (context) => {
    const { req,query } = context;
    const { origin } = absoluteUrl(req)
  
    const projectRes = await axios.get(`${origin}/api/project/getAllProjects`)
    const projectsList = await projectRes.data
    //console.log(projects)
    return{
      props:{ 
        projectsList
      }
    }
}


const ProjectListPage = ({projectsList}) => {

    console.log('Total Project List', projectsList);

    const [project, setProject] = useState(projectsList)

    useEffect(() => {
    },[project])

    const [{user_details},dispatch] = useUserValue();
    //console.log(user_details);

    const handleDeleteProject = async (id) => {
        console.log(id)

        const deleteProject = await axios.post('/api/project/deleteProjectById',{
            id
        })

        if(deleteProject.status == 200){
            const updatedProjectList = project.filter(projectData => projectData._id != id)
            console.log('update',updatedProjectList)
            setProject(updatedProjectList)
            toast('Project deleted successfully');
        }
        else{
            toast.error('Project cannot be deleted');
        }
    }
    
  return (
    <>
        <Navbar />
        <ToastContainer />
        <div className='container-fluid'>
            <div className='row mt-3'>
                <div className="col-2 offset-10 d-flex justify-content-end">
                    <Link href="/projects/addProject">
                        <a className="btn btn-primary">Add Project <i className="bi bi-folder-plus"></i></a>
                    </Link>
                </div>
            </div>
        </div>

        <div className="mx-2 my-2 ">
            <table className="table table-hover table-striped table-responsive">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Description</th>
                        <th className='text-center px-5'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {project && project.map((data, index) => {
                        return <>
                            <tr key={`{index}_row`}>
                                <td>{index+1}</td>
                                <td>{data.projectname}</td>
                                <td>{data.description}</td>
                                <td className='text-center'>
                                    <Link href={`/projects/editProject/${data._id}`}>
                                        <a className="btn btn-primary">Edit <i className="bi bi-pencil-square"></i></a>
                                    </Link>
                                    <button className="btn btn-danger mx-1" onClick={()=>{if(window.confirm("Are you sure? You want to delete this project !")){
                                        handleDeleteProject(data._id)
                                    }}}>Delete <i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        </>
                    })}
                </tbody>
            </table>
        </div>
    </>
  )
}

export default ProjectListPage