'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/lib/routes'
import { Home, ShoppingBag, Grid, Sparkles, Tag } from 'lucide-react'

const BottomNavbar = () => {
  const pathname = usePathname()

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/70 backdrop-blur-md border-t z-50">
      <div className="flex items-center justify-around h-full px-2">
        {routes.map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.path
          
          return (
            <Link
              key={route.path}
              href={route.path}
              className={`relative flex flex-col items-center justify-center w-16 h-full ${
                isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
              }`}
            >
              <div className="flex flex-col items-center">
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{route.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="bottom-tab"
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavbar
