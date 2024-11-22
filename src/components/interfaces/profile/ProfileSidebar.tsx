'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Divider,
} from '@nextui-org/react'
import { User, Package, Settings, Menu, X } from 'lucide-react'
import { UserProfile } from '@/lib/types/user'
import { cn } from '@/helpers/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileSidebarProps {
  profile: UserProfile
  className?: string
}

const tabs = [
  {
    key: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    key: 'orders',
    label: 'Orders',
    icon: Package,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: Settings,
  },
]

export default function ProfileSidebar({ profile, className }: ProfileSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = React.useState(false)
  const activeTab = searchParams.get('tab') || 'profile'

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('tab', tab)
    router.push(`/profile?${params.toString()}`)
    setIsOpen(false)
  }

  const SidebarContent = () => (
    <>
      <div className="flex flex-col items-center gap-4 p-6">
        <Avatar
          src={profile.avatar}
          className="w-24 h-24"
          showFallback
          name={profile.name}
        />
        <div className="text-center">
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col p-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "flat" : "light"}
              className={cn(
                "justify-start gap-2 mb-1",
                activeTab === tab.key && "bg-primary-100 text-primary-600"
              )}
              onClick={() => handleTabChange(tab.key)}
            >
              <Icon size={20} />
              <span>{tab.label}</span>
            </Button>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Menu */}
      <div className="md:hidden relative">
        <Button
          isIconOnly
          variant="light"
          onClick={() => setIsOpen(true)}
          className="absolute left-4 top-4 z-30"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="fixed inset-x-0 top-[64px] bottom-0 sm:bottom-0 bg-black/50 z-30"
                onClick={() => setIsOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed left-0 top-[64px] bottom-0 sm:bottom-0 w-[280px] bg-background z-30 overflow-y-auto"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-end p-4">
                    <Button 
                      isIconOnly 
                      variant="light" 
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex-1">
                    <SidebarContent />
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop Sidebar */}
      <Card className={cn('hidden md:block h-fit', className)}>
        <CardBody className="p-0">
          <SidebarContent />
        </CardBody>
      </Card>
    </>
  )
}
