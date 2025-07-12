import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../pages/ShardeComponents/Navbar/Navbar'

export default function HomeLayout() {
  return (

    <>

      {/* <div className='w-11/12 mx-auto'> */}

        <Navbar />


        <Outlet />


      {/* </div> */}
      {/* <Footer /> */}

    </>
  )
}
