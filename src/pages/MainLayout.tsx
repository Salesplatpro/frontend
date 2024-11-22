import React from 'react'
import { Outlet } from 'react-router-dom'

import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

export const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
)
