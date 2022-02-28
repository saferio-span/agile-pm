import React from 'react'
import globalStyles from "../styles/global.module.css"
import Navbar from '../components/Navbar'
import styles from '../styles/settings.module.css'
import Link from 'next/link'

const Settings = () => {
  return (
    <>
      <Navbar />
      <div className={`${globalStyles.background} container-fluid `}>
        <div className="row mt-2 mx-3">
          <div className="col-4">
            <Link href="/roles">
                <div className={`card ${styles.customCard}`}>
                  <div className="card-body">
                      <div className="row">
                        <div className="col-2">
                          <i className={`${styles.customIcon} bi bi-person-workspace`}></i>
                        </div>
                        <div className="col-10">
                          <p className='h2'>
                            Roles
                          </p>
                          <p >
                            Define users role and other details
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
            </Link>
          </div>

          <div className="col-4">
            <Link href="/users">
              <div className={`card ${styles.customCard}`}>
                <div className="card-body">
                    <div className="row">
                      <div className="col-2">
                        <i className={` ${styles.customIcon} bi bi-person`}></i>
                      </div>
                      <div className="col-10">
                        <p className='h2'>
                          Users
                        </p>
                        <p >
                          View list of users, roles assigned to the users and their states
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-4">
            <Link href="/projects">
              <div className={`card ${styles.customCard}`}>
                <div className="card-body">
                    <div className="row">
                      <div className="col-2">
                        <i className={` ${styles.customIcon} bi bi-people-fill`}></i>
                      </div>
                      <div className="col-10">
                        <p className='h2'>
                          Projects
                        </p>
                        <p >
                          View list of project and project members assigned to the project
                        </p>
                      </div>
                    </div>
                </div>
              </div>
            </Link>
          </div>

        </div>
      </div>
    </>
    
  )
}

export default Settings