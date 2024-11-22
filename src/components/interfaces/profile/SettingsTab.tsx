'use client'

import React from 'react'
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Divider,
} from '@nextui-org/react'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/helpers/utils'

export default function SettingsTab() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isVisible, setIsVisible] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')

  const toggleVisibility = () => setIsVisible(!isVisible)

  const handleChangePassword = () => {
    // Implement password change logic here
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h3 className="text-xl font-semibold mb-6">
          <Shield className="inline-block mr-2" size={24} />
          Privacy Settings
        </h3>

        <Card className="mb-4">
          <CardBody>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-medium">Password</h4>
                <p className="text-sm text-gray-500">
                  Change your password to keep your account secure
                </p>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={onOpen}
                  className="w-fit"
                >
                  Change Password
                </Button>
              </div>

              <Divider />

              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-medium">Profile Visibility</h4>
                <p className="text-sm text-gray-500">
                  Control who can see your profile information
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    color="primary"
                    variant="bordered"
                    className="w-fit"
                  >
                    Make Profile Private
                  </Button>
                  <p className="text-xs text-gray-400">
                    When your profile is private, only you can see your order history and favorites
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        placement="center"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Change Password</h3>
                <p className="text-sm text-gray-500">
                  Please enter your current password and choose a new one
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    variant="bordered"
                    placeholder="Enter your current password"
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Input
                    label="New Password"
                    variant="bordered"
                    placeholder="Enter your new password"
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Input
                    label="Confirm New Password"
                    variant="bordered"
                    placeholder="Confirm your new password"
                    endContent={
                      <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleChangePassword}>
                  Change Password
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  )
}
