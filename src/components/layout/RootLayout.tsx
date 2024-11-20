'use client'

import React from 'react'
import BottomNavbar from './BottomNavbar'
import Footer from './Footer'
import { Toaster } from 'react-hot-toast'
import TopNavbar from './TopNavbar'

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />
      <main className="flex-grow container mx-auto px-4 pb-20 sm:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNavbar />
      <Toaster position="top-center" />
    </div>
  )
}

export default RootLayout
