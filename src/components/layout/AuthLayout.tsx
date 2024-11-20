'use client'

import React from 'react'
import { Card } from '@nextui-org/react'
import { Toaster } from 'react-hot-toast'
import Image from 'next/image'

interface AuthLayoutProps {
  children: React.ReactNode
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center mb-4">
          <Image
            src="/logo.png"
            alt="FemLux Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
          <p className="text-sm text-default-500 mt-2">Your Fashion Destination</p>
        </div>
        {children}
      </Card>
      <Toaster position="top-center" />
    </div>
  )
}

export default AuthLayout
