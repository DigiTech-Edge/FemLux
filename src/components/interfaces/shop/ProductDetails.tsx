'use client'

import React from 'react'
import Image from 'next/image'
import {
  Button,
  Tabs,
  Tab,
  Card,
  CardBody,
  Divider,
} from '@nextui-org/react'
import { Heart, Minus, Plus, ShoppingCart, Star, Truck } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProductDetails as ProductDetailsType } from '@/lib/types/product-details'
import { cn } from '@/helpers/utils'
import { ProductCarousel } from '@/components/interfaces/home/CarouselWrapper'
import { products } from '@/lib/data/products'
import Carousel from '@/components/ui/Carousel'
import { Product } from '@/lib/types/products'

interface ProductDetailsProps {
  product: ProductDetailsType
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedColor, setSelectedColor] = React.useState<string>(product.colors[0])
  const [selectedSize, setSelectedSize] = React.useState<string>(product.sizes[0])
  const [quantity, setQuantity] = React.useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const mainCarouselRef = React.useRef<{ scrollTo: (index: number) => void } | null>(null)

  const relatedProducts = product.relatedProducts?.map(id => 
    products.find(p => p.id === id)
  ).filter(Boolean) || []

  const handleQuantityChange = (increment: boolean) => {
    setQuantity(prev => {
      const newQuantity = increment ? prev + 1 : prev - 1
      return Math.max(1, Math.min(newQuantity, product.stock))
    })
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
    mainCarouselRef.current?.scrollTo(index)
  }

  return (
    <main className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        {/* Product Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Carousel */}
            <div className="relative w-full">
              <Carousel 
                ref={mainCarouselRef}
                showControls 
                showIndicators
                slideWidth="100%"
                className="w-full"
                loop
                onSelect={setSelectedImageIndex}
              >
                {product.images.map((image, idx) => (
                  <div key={idx} className="relative w-full flex-[0_0_100%]">
                    <div className="relative aspect-square w-full">
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        priority={idx === 0}
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>

            {/* Thumbnail Carousel */}
            <div className="relative w-full h-24">
              <Carousel
                showControls
                showIndicators={false}
                slideWidth="20%"
                className="w-full h-full"
                loop
              >
                {product.images.map((image, idx) => (
                  <div key={idx} className="relative w-full flex-[0_0_20%] px-1">
                    <div 
                      className={cn(
                        "relative aspect-square w-full cursor-pointer rounded-md overflow-hidden",
                        selectedImageIndex === idx ? "ring-2 ring-primary" : "ring-1 ring-gray-200"
                      )}
                      onClick={() => handleThumbnailClick(idx)}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="20vw"
                      />
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-4 h-4",
                        i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">{product.brand}</span>
              </div>
              <p className="text-2xl font-semibold text-primary">
                ${product.price.toFixed(2)}
              </p>
            </motion.div>

            <Divider />

            {/* Color Selection */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-sm font-medium">Color</h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    className={cn(
                      "min-w-[4rem] h-8",
                      selectedColor === color ? "ring-2 ring-primary" : ""
                    )}
                    variant={selectedColor === color ? "solid" : "bordered"}
                    onPress={() => setSelectedColor(color)}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-sm font-medium">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    className={cn(
                      "min-w-[4rem] h-8",
                      selectedSize === size ? "ring-2 ring-primary" : ""
                    )}
                    variant={selectedSize === size ? "solid" : "bordered"}
                    onPress={() => setSelectedSize(size)}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-medium">Quantity</h3>
              <div className="flex items-center gap-2">
                <Button
                  isIconOnly
                  variant="bordered"
                  onPress={() => handleQuantityChange(false)}
                  isDisabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  isIconOnly
                  variant="bordered"
                  onPress={() => handleQuantityChange(true)}
                  isDisabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 ml-2">
                  {product.stock} items available
                </span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                color="primary"
                size="lg"
                className="flex-1"
                startContent={<ShoppingCart className="w-4 h-4" />}
              >
                Add to Cart
              </Button>
              <Button
                variant="bordered"
                size="lg"
                startContent={<Heart className="w-4 h-4" />}
              >
                Wishlist
              </Button>
            </motion.div>

            {/* Delivery Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="bg-gray-50">
                <CardBody className="flex flex-row items-center gap-4">
                  <Truck className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-medium">Free Delivery</p>
                    <p className="text-sm text-gray-600">
                      Enter your postal code for delivery availability
                    </p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs 
            aria-label="Product details" 
            variant="underlined"
            color="primary"
            fullWidth
            
          >
            <Tab key="description" title="Description">
              <div>
                <div>
                  <p className="text-gray-600">{product.description}</p>
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Key Features</h4>
                    <ul className="list-disc list-inside space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="text-gray-600">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="specifications" title="Specifications">
              <div>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b">
                        <span className="font-medium">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="reviews" title={`Reviews (${product.reviews})`}>
              <div>
                <div>
                  <div className="text-center py-8">
                    <h3 className="text-2xl font-semibold mb-2">
                      {product.rating.toFixed(1)} out of 5
                    </h3>
                    <div className="flex justify-center items-center gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5",
                            i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">Based on {product.reviews} reviews</p>
                  </div>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
            <ProductCarousel 
              products={relatedProducts.filter((p): p is Product => p !== undefined)} 
            />
          </section>
        )}
      </div>
    </main>
  )
}
