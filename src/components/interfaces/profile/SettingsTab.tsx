"use client";

import React from "react";
import {
  Input,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordUpdate } from "@/types/profile";
import { Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

interface SettingsTabProps {
  onPasswordChange: (data: PasswordUpdate) => Promise<void>;
}

export default function SettingsTab({ onPasswordChange }: SettingsTabProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<PasswordUpdate>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordUpdate) => {
    try {
      setIsLoading(true);
      await onPasswordChange(data);
      form.reset();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

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
          Security Settings
        </h3>

        <Card className="mb-4">
          <CardBody>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-medium">Password</h4>
                <p className="text-sm text-default-500">
                  Change your password to keep your account secure
                </p>
                <Button
                  color="primary"
                  variant="flat"
                  onPress={onOpen}
                  className="w-fit max-w-md"
                >
                  Change Password
                </Button>
              </div>

              <Divider />
            </div>
          </CardBody>
        </Card>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          form.reset();
        }}
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <ModalHeader className="flex flex-col gap-1">
                <h3>Change Password</h3>
                <p className="text-sm text-default-500">
                  Please enter your current password and choose a new one
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    variant="bordered"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    {...form.register("currentPassword")}
                    errorMessage={
                      form.formState.errors.currentPassword?.message
                    }
                    isInvalid={!!form.formState.errors.currentPassword}
                    isRequired
                    isDisabled={isLoading}
                  />
                  <Input
                    label="New Password"
                    variant="bordered"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    {...form.register("newPassword")}
                    errorMessage={form.formState.errors.newPassword?.message}
                    isInvalid={!!form.formState.errors.newPassword}
                    isRequired
                    isDisabled={isLoading}
                  />
                  <Input
                    label="Confirm New Password"
                    variant="bordered"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? (
                          <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <Eye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    {...form.register("confirmPassword")}
                    errorMessage={
                      form.formState.errors.confirmPassword?.message
                    }
                    isInvalid={!!form.formState.errors.confirmPassword}
                    isRequired
                    isDisabled={isLoading}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => {
                    onClose();
                    form.reset();
                  }}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                  Change Password
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
