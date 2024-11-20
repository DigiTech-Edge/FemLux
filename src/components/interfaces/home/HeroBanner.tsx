'use client'

import React from 'react'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import Image from 'next/image'
import Carousel from '@/components/ui/Carousel'
import { banners } from '@/lib/data/banners'

const HeroBanner = () => {
  return (
    <Carousel 
      autoplay 
      loop 
      showIndicators 
      showControls
      slideWidth="100%"
      autoplayDelay={5000}
      className="w-full"
    >
      {banners.map((slide) => (
        <div key={slide.id} className="relative w-full flex-[0_0_100%]">
          <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 leading-tight">{slide.title}</h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 md:mb-10 max-w-xl">{slide.description}</p>
              <Button
                as={Link}
                href={slide.link}
                color="primary"
                size="lg"
                className="max-w-fit font-semibold text-lg px-8 h-12"
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  )
}

export default HeroBanner
