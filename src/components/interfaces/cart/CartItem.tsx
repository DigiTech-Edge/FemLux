'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button, Select, SelectItem } from '@nextui-org/react'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { CartItem as CartItemType } from '@/lib/types/cart'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, quantity: number) => void
  onUpdateColor: (id: number, color: string) => void
  onUpdateSize: (id: number, size: string) => void
  onRemove: (id: number) => void
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onUpdateColor,
  onUpdateSize,
  onRemove,
}: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex gap-4 p-4 border rounded-lg bg-content1 hover:border-pink-200 transition-colors"
    >
      {/* Product Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden group">
        <Image
          src={item.images[0]}
          alt={item.name}
          fill
          className="object-cover transition-transform group-hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-default-500">{item.brand}</p>
          </div>
          <Button
            isIconOnly
            variant="light"
            onPress={() => onRemove(item.id)}
            className="text-default-400 hover:text-danger transition-colors"
          >
            <Trash2 size={18} className='text-primary'/>
          </Button>
        </div>

        {/* Options */}
        <div className="flex gap-2 mt-2">
          <Select
            size="sm"
            selectedKeys={[item.selectedColor]}
            onChange={(e) => onUpdateColor(item.id, e.target.value)}
            classNames={{
              trigger: "h-8 min-h-unit-8 py-0",
              value: "text-small",
            }}
            variant="bordered"
            className='w-28'
          >
            {item.colors.map((color) => (
              <SelectItem key={color} value={color} className="text-small">
                {color}
              </SelectItem>
            ))}
          </Select>

          <Select
            size="sm"
            selectedKeys={[item.selectedSize]}
            onChange={(e) => onUpdateSize(item.id, e.target.value)}
            classNames={{
              trigger: "h-8 min-h-unit-8 py-0",
              value: "text-small",
            }}
            className='w-28'
            variant="bordered"
          >
            {item.sizes.map((size) => (
              <SelectItem key={size} value={size} className="text-small">
                {size}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Quantity and Price */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-6 bg-default-100 rounded-full px-4 py-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="w-8 h-8 min-w-unit-8 bg-white rounded-full shadow-small hover:bg-pink-50 text-pink-500"
            >
              <Minus size={14} />
            </Button>
            <motion.span 
              key={item.quantity}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-8 text-center font-medium"
            >
              {item.quantity}
            </motion.span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onUpdateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
              className="w-8 h-8 min-w-unit-8 bg-white rounded-full shadow-small hover:bg-pink-50 text-pink-500"
            >
              <Plus size={14} />
            </Button>
          </div>

          {/* Price Display */}
          <div className="flex items-center gap-2">
            <div className="text-center">
              <motion.p 
                key={item.quantity}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent"
              >
                ${(item.price * item.quantity).toFixed(2)}
              </motion.p>
              <p className="text-xs text-default-400">
                ${item.price.toFixed(2)} per item
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
