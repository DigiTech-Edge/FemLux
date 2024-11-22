'use client'

import React from 'react'
import {
  Card,
  CardBody,
  Button,
  Input,
  Textarea,
  Divider,
} from '@nextui-org/react'
import { motion } from 'framer-motion'
import { UserProfile } from '@/lib/types/user'
import { cn } from '@/helpers/utils'

interface ProfileTabProps {
  profile: UserProfile
}

export default function ProfileTab({ profile }: ProfileTabProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone || '',
    street: profile.address?.street || '',
    city: profile.address?.city || '',
    state: profile.address?.state || '',
    postalCode: profile.address?.postalCode || '',
    country: profile.address?.country || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <Card className="border-none">
        <CardBody className="gap-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Personal Information</h3>
            <Button
              color="primary"
              variant={isEditing ? "solid" : "light"}
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              name="name"
              onChange={handleInputChange}
              isReadOnly={!isEditing}
              variant={isEditing ? "bordered" : "flat"}
              classNames={{
                input: cn(
                  "bg-transparent",
                  !isEditing && "text-foreground-600"
                ),
              }}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
              isReadOnly={!isEditing}
              variant={isEditing ? "bordered" : "flat"}
              classNames={{
                input: cn(
                  "bg-transparent",
                  !isEditing && "text-foreground-600"
                ),
              }}
            />
            <Input
              label="Phone Number"
              placeholder="Enter your phone number"
              value={formData.phone}
              name="phone"
              onChange={handleInputChange}
              isReadOnly={!isEditing}
              variant={isEditing ? "bordered" : "flat"}
              classNames={{
                input: cn(
                  "bg-transparent",
                  !isEditing && "text-foreground-600"
                ),
              }}
            />
            <Input
              isReadOnly
              label="Member Since"
              value={new Date(profile.dateJoined).toLocaleDateString()}
              variant="flat"
              classNames={{
                input: "bg-transparent text-foreground-600",
              }}
            />
          </div>

          <Divider />

          <div>
            <h4 className="text-lg font-medium mb-4">Shipping Address</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Street Address"
                placeholder="Enter your street address"
                value={formData.street}
                name="street"
                onChange={handleInputChange}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                classNames={{
                  input: cn(
                    "bg-transparent",
                    !isEditing && "text-foreground-600"
                  ),
                }}
              />
              <Input
                label="City"
                placeholder="Enter your city"
                value={formData.city}
                name="city"
                onChange={handleInputChange}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                classNames={{
                  input: cn(
                    "bg-transparent",
                    !isEditing && "text-foreground-600"
                  ),
                }}
              />
              <Input
                label="State/Province"
                placeholder="Enter your state/province"
                value={formData.state}
                name="state"
                onChange={handleInputChange}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                classNames={{
                  input: cn(
                    "bg-transparent",
                    !isEditing && "text-foreground-600"
                  ),
                }}
              />
              <Input
                label="Postal Code"
                placeholder="Enter your postal code"
                value={formData.postalCode}
                name="postalCode"
                onChange={handleInputChange}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                classNames={{
                  input: cn(
                    "bg-transparent",
                    !isEditing && "text-foreground-600"
                  ),
                }}
              />
              <Input
                label="Country"
                placeholder="Enter your country"
                value={formData.country}
                name="country"
                onChange={handleInputChange}
                isReadOnly={!isEditing}
                variant={isEditing ? "bordered" : "flat"}
                classNames={{
                  input: cn(
                    "bg-transparent",
                    !isEditing && "text-foreground-600"
                  ),
                }}
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                onPress={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSave}
              >
                Save Changes
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  )
}
