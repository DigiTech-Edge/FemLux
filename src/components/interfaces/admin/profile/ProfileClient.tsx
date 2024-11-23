"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { AdminProfile } from "@/lib/types/profile";
import { Eye, EyeOff } from "lucide-react";

interface ProfileClientProps {
  profile: AdminProfile;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handlePasswordChange = () => {
    // Here you would typically make an API call to change the password
    console.log("Password change requested");
    onClose();
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardBody className="gap-4">
          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar
              className="w-24 h-24 text-large"
              src={profile.avatar}
              showFallback
              name={profile.name}
            />
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <p className="text-default-500">{profile.email}</p>
              <p className="text-small text-default-400">
                Admin since {new Date(profile.createdAt).toLocaleDateString()}
              </p>
              <p className="text-small text-default-400">
                Last login: {new Date(profile.lastLogin).toLocaleString()}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Change Password */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Password</h3>
              <p className="text-small text-default-500">
                Change your password to keep your account secure
              </p>
            </div>
            <Button color="primary" onPress={onOpen}>
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalBody>
            <Input
              label="Current Password"
              placeholder="Enter your current password"
              type={isVisible ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
            />
            <Input
              label="New Password"
              placeholder="Enter your new password"
              type={isVisible ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
            />
            <Input
              label="Confirm New Password"
              placeholder="Confirm your new password"
              type={isVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeOff className="w-4 h-4 text-default-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-default-400" />
                  )}
                </button>
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handlePasswordChange}
              isDisabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword
              }
            >
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
