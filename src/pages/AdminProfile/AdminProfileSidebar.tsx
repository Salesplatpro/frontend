import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/contextHook'
import '../TalentProfile/TalentProfileSidebar.scss'
import {SideBar} from "../../components";

const AdminDashboard = () => {
  // const auth = useAuth()

  return (
    <div className="dashboard">
      <div className="sidebar-container">
        <SideBar />
      </div>
      <div className="dashboard-body">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard;
