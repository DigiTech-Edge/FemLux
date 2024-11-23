import React from 'react'
import RootLayout from '@/components/layout/RootLayout'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <RootLayout>{children}</RootLayout>
}
