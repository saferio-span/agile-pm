import React,{ useState,useEffect} from 'react';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUserValue } from '../../contexts/UserContext'
import axios from 'axios';
import { toast,ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import absoluteUrl from 'next-absolute-url'
import { SearchIcon } from '@chakra-ui/icons';
import ReactPaginate from "react-paginate"
import { Input, InputGroup,  InputLeftElement,FormHelperText,Heading,Text,Checkbox } from '@chakra-ui/react'
import { 
    Flex, 
    Spacer , 
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react'


export const getServerSideProps = async (context) => {
    const { req,query } = context;
    const { origin } = absoluteUrl(req)
    
    const projectRes = await axios.get(`${origin}/api/project/getAllProjects?page=0&searchTerm=null`)
    const projectsList = await projectRes.data
    console.log(projectsList);

    return{
      props:{ 
        projectsList
      }
    }
}


const ProjectListPage = ({projectsList}) => {

    //console.log('Total Project List', projectsList);
    // const [project, setProject] = useState(projectsList)

    const [pageNumber, setPageNumber] = useState(0); 
    const [numberOfPages, setNumberOfPages] = useState(projectsList.totalpages);
    const [searchText, setSearchText] = useState(null);
    //const [items, setItems] = useState([]); //Entire Page Content
    const [project, setProject] = useState(projectsList.projects); //Entire Page Content


    const pages = new Array(numberOfPages).fill(null).map((v, i) => i)
    //console.log('pages', pages)


    const getAllItems = async(pagenum, search) => {
        //console.log('pagenum', pagenum)
        const res = await axios.get(`/api/project/getAllProjects?page=${pagenum}&searchTerm=${search}`);
        const details = await res.data
        //console.log('details', details)
        setProject(details.projects);
        setNumberOfPages(details.totalpages);
    }


    const [{user_details},dispatch] = useUserValue();
    //console.log(user_details);


    const handleDeleteProject = async (id) => {
        //console.log(id)
        const deleteProject = await axios.post('/api/project/deleteProjectById',{
            id
        })

        if(deleteProject.status == 200){
            const updatedProjectList = project.filter(projectData => projectData._id != id)
            // console.log('update',updatedProjectList)
            setProject(updatedProjectList)
            toast('Project deleted successfully');
        }
        else{
            toast.error('Project cannot be deleted');
        }
    }


    const handlePageClick = (pageIndex) => {
        //console.log('Pagination: ', pageIndex)
        setPageNumber(pageIndex.selected);
        getAllItems(pageIndex.selected, searchText);
    }


    const handleSearch = (e) => {
        // console.log('Search Term', e.target.value);
        const searchTextTerm = e.target.value;
        if(searchTextTerm != ''){
            setSearchText(searchTextTerm);
            getAllItems(pageNumber, searchTextTerm);
        }
        else{
            console.log("Search null")
            setSearchText(null);
            getAllItems(pageNumber, null);
        }
    }
    

  return (
    <>
        <Navbar />
        <div className='custom-body'>
            <ChakraProvider>
                <ToastContainer />
                <div className='container-fluid'>
                    <div className='row mt-3'>
                        {/* <div className="col-3">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1"><i className="bi bi-search"></i></span>
                                <input type="text" className="form-control" placeholder="Search" onChange={handleSearch} />
                            </div>
                        </div> */}
                        <div className="col-3">
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents='none'
                                    children={<SearchIcon color='gray.300' />}
                                />
                                <Input type='text' onChange={handleSearch} placeholder='Search Projects...' />
                            </InputGroup>
                        </div>
                        <div className="col-3 offset-6 d-flex justify-content-end">
                            <Link href="/projects/addProject">
                                <a className="btn btn-primary">Create New Project <i className="bi bi-folder-plus"></i></a>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mx-2 my-2 ">
                    <table className="table table-hover table-striped table-responsive">
                        <thead>
                            <tr>
                                <th><input className="form-check-input" type="checkbox" name='bulkSelectProject' id="bulkSelectProject" /></th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th className='text-center px-5'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {project && project.map((data, index) => {
                                return <>
                                    <tr key={`{index}_row`}>
                                        <td><input className="form-check-input individualSelectProject" type="checkbox" name='individualSelectProject' id={`project_${data._id}`} value={data._id} /></td>
                                        <td>
                                            <Link href={`/projects/assignProject/${data._id}`}>
                                                <a>{data.projectname}</a>
                                            </Link>
                                        </td>
                                        <td>{data.description}</td>
                                        <td className='text-center'>
                                            <Link href={`/projects/editProject/${data._id}`}>
                                                <a className=""><i className="bi bi-pencil-fill"></i></a>
                                            </Link>
                                            <Menu>
                                                <MenuButton className="mx-2">
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem onClick={()=>{if(window.confirm("Are you sure? You want to delete this project !")){
                                                        handleDeleteProject(data._id)
                                                    }}}>Delete <i className="bi bi-trash"></i></MenuItem>
                                                </MenuList>
                                            </Menu>
                                            {/* <button className="btn btn-danger mx-1" onClick={()=>{if(window.confirm("Are you sure? You want to delete this project !")){
                                                handleDeleteProject(data._id)
                                            }}}>Delete <i className="bi bi-trash"></i></button> */}
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="row">
                    <div className="col offset-s4">
                        <ReactPaginate
                            previousLabel={"<<"}
                            nextLabel={">>"}
                            breakLabel={"..."}
                            pageCount={pages.length}
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
            </ChakraProvider>
        </div>
    </>
  )
}

export default ProjectListPage