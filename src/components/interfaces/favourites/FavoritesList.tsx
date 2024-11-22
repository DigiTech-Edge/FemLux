'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@nextui-org/react'
import { ShoppingCart, Trash2, Eye, StarIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Product } from '@/lib/types/products'
import { FavoriteItem } from '@/lib/types/favorites'
import { products } from '@/lib/data/products'
import Carousel from '@/components/ui/Carousel'
import { cn } from '@/helpers/utils'

interface FavoritesListProps {
  favorites: FavoriteItem[]
}

type FavoriteProduct = Product & {
  dateAdded: string
  note: string | undefined
}

export default function FavoritesList({ favorites }: FavoritesListProps) {
  // Merge favorites with product data and filter out any favorites where the product doesn't exist
  const favoriteProducts = favorites
    .map(favorite => {
      const product = products.find(p => p.id === favorite.productId)
      if (!product) return null
      return {
        ...product,
        dateAdded: favorite.dateAdded,
        note: favorite.note || undefined
      } as FavoriteProduct
    })
    .filter((product): product is FavoriteProduct => product !== null)

  if (!favoriteProducts || favoriteProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <p className="text-gray-600">No favorites found</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 min-[500px]:grid-cols-2 grid-cols-1 gap-4">
      {favoriteProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="w-full"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group h-full flex flex-col">
            <div className="relative w-full">
              <Carousel 
                showControls 
                showIndicators
                slideWidth="100%"
                className="w-full h-full"
              >
                {product.images.map((image, idx) => (
                  <div key={idx} className="relative w-full flex-[0_0_100%]">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={image}
                        alt={`${product.name} - View ${idx + 1}`}
                        fill
                        priority={idx === 0}
                        className="object-cover rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            </div>

            <div className="p-4 flex-grow flex flex-col">
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                  <span className="text-sm font-semibold text-primary whitespace-nowrap ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-600">{product.brand}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-600">{product.category}</span>
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
                    <span className="text-xs text-gray-600 ml-1">({product.reviews})</span>
                  </div>
                )}

                {product.note && (
                  <p className="text-xs text-gray-600 italic mb-2 line-clamp-2">
                    Note: {product.note}
                  </p>
                )}

                <div className="flex items-center text-xs text-gray-500 mb-3">
                  Added {new Date(product.dateAdded).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Link href={`/shop/${product.id}`} className="flex-1">
                  <Button
                    variant="flat"
                    size="sm"
                    color='primary'
                    className="w-full"
                    startContent={<Eye className="w-4 h-4" />}
                  >
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  className="bg-primary text-white"
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  className="text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
