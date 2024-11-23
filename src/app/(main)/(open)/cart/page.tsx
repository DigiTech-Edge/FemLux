'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  useDisclosure,
  Textarea,
} from '@nextui-org/react'
import { ShoppingBag } from 'lucide-react'
import CartItem from '@/components/interfaces/cart/CartItem'
import CartSummary from '@/components/interfaces/cart/CartSummary'
import EmptyCart from '@/components/interfaces/cart/EmptyCart'
import { mockCartItems } from '@/lib/data/cart'

interface CheckoutDetails {
  email: string
  contact: string
  address: string
  saveDetails: boolean
}

const mockUserDetails = {
  email: 'sarah.wilson@example.com',
  contact: '+1 234 567 8900',
  address: '123 Fashion Street, Style City, SC 12345',
}

export default function CartPage() {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [items, setItems] = React.useState(mockCartItems)
  const [checkoutDetails, setCheckoutDetails] = React.useState<CheckoutDetails>({
    email: mockUserDetails.email,
    contact: mockUserDetails.contact,
    address: mockUserDetails.address,
    saveDetails: false,
  })

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity } : item
    ))
    toast.success('Cart updated')
  }

  const handleUpdateColor = (id: number, color: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selectedColor: color } : item
    ))
    toast.success('Color updated')
  }

  const handleUpdateSize = (id: number, size: string) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, selectedSize: size } : item
    ))
    toast.success('Size updated')
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
    toast.success('Item removed from cart')
  }

  const handleCheckoutSubmit = () => {
    if (checkoutDetails.saveDetails) {
      toast.success('Details saved for future checkouts')
    }
    toast.success('Redirecting to Paystack...')
    router.push('/checkout')
    onClose()
  }

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <>
      <div className="mx-auto px-0 py-8">
        <div className="flex items-center justify-between mb-8 px-4 lg:px-0 lg:max-w-[calc(66.666667%-1rem)] lg:ml-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="p-3 rounded-full bg-pink-100">
              <ShoppingBag className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent">
                Shopping Cart
              </h1>
              <p className="text-default-500">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 relative">
          {/* Cart Items */}
          <div className="lg:col-span-2 px-4 lg:pr-8">
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onUpdateColor={handleUpdateColor}
                    onUpdateSize={handleUpdateSize}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </AnimatePresence>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1 px-4 lg:px-8 mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-8rem)] lg:overflow-auto">
              <CartSummary
                items={items}
                onCheckout={onOpen}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        classNames={{
          base: "max-w-[600px]",
          header: "border-b",
          body: "py-6",
          footer: "border-t",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">Checkout Details</h2>
            <p className="text-sm text-default-500">Please confirm your details before proceeding to payment</p>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-6">
              <Input
                label="Email"
                value={checkoutDetails.email}
                isReadOnly
                variant="bordered"
                classNames={{
                  input: "text-default-500",
                }}
              />
              <Input
                label="Contact Number"
                value={checkoutDetails.contact}
                onValueChange={(value) => setCheckoutDetails({ ...checkoutDetails, contact: value })}
                variant="bordered"
                placeholder="Enter your contact number"
              />
              <Textarea
                label="Shipping Address"
                value={checkoutDetails.address}
                onValueChange={(value) => setCheckoutDetails({ ...checkoutDetails, address: value })}
                variant="bordered"
                placeholder="Enter your shipping address"
                minRows={3}
              />
              <Checkbox
                isSelected={checkoutDetails.saveDetails}
                onValueChange={(value) => setCheckoutDetails({ ...checkoutDetails, saveDetails: value })}
                color="secondary"
              >
                Save these details for future purchases
              </Checkbox>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="secondary"
              variant="shadow"
              onPress={handleCheckoutSubmit}
              className="bg-gradient-to-r from-pink-600 to-pink-400 text-white shadow-lg"
            >
              Proceed to Paystack
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
