'use client'

import React from 'react'
import { Button } from '@nextui-org/react'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  description: string
  viewAllLink?: string
}

export default function SectionHeader({ title, description, viewAllLink }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8 px-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-default-500">{description}</p>
      </div>
      {viewAllLink && (
        <Button
          as={Link}
          href={viewAllLink}
          variant="light"
          color="primary"
          endContent={<ArrowRight className="w-4 h-4" />}
          className='hover:underline underline-offset-8 hover:text-primary transition-colors ease-in-out duration-300'
        >
          View All
        </Button>
      )}
    </div>
  )
}
