'use client'

import { Card } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react'

const DashboardPage = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '$12,345',
      change: '+12%',
      icon: DollarSign,
      color: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: '156',
      change: '+8%',
      icon: Package,
      color: 'text-blue-500'
    },
    {
      title: 'Total Users',
      value: '2,345',
      change: '+15%',
      icon: Users,
      color: 'text-purple-500'
    },
    {
      title: 'Growth Rate',
      value: '23%',
      change: '+2%',
      icon: TrendingUp,
      color: 'text-pink-500'
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={item}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className={`'p-3 rounded-lg', ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-default-500">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-semibold">{stat.value}</h3>
                    <span className="text-xs text-success">{stat.change}</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Add more dashboard content here */}
    </div>
  )
}

export default DashboardPage
