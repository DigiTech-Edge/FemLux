'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@nextui-org/react'
import { Heart, ShoppingCart, StarIcon } from 'lucide-react'
import { Product } from '@/lib/types/products'
import { cn } from '@/lib/utils'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Carousel from './Carousel'

interface ProductCardProps {
  product: Product
  index: number
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  console.log(product.images)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group">
        <div className="relative w-full">
          <Carousel 
            showControls 
            showIndicators
            slideWidth="100%"
            className="w-full"
          >
            {product.images.map((image, idx) => (
              <div key={idx} className="relative w-full flex-[0_0_100%]">
                <div className="relative aspect-square w-full">
                  <Image
                    src="/image.png"
                    alt={`${product.name} - View ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                </div>
              </div>
            ))}
          </Carousel>
          {product.isNew && (
            <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded z-10">
              New
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg z-10">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-yellow-50 transition-colors">
              <Heart className="w-4 h-4 text-yellow-500 hover:text-yellow-600" />
            </button>
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors">
              <ShoppingCart className="w-4 h-4 text-pink-500 hover:text-pink-600" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
            <span className="text-sm font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">{product.brand}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">{product.category}</span>
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={cn(
                      "w-3 h-3",
                      i < product.rating ? "text-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                ({product.reviews} reviews)
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.colors.slice(0, 3).map(color => (
              <span
                key={color}
                className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
              >
                {color}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="inline-block px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
          <Link href={`/shop/${product.id}`}>
            <Button
              className="w-full"
              color="primary"
              variant="flat"
              size="sm"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
