import React from 'react'
import { Outlet } from 'react-router'
import Navbar from '../pages/ShardeComponents/Navbar/Navbar'
import Footer from '../pages/ShardeComponents/Footer'

export default function HomeLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed height Navbar */}
      <div className="h-[61px]">
        <Navbar />
      </div>

      {/* Content that fills remaining space */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  )
}
