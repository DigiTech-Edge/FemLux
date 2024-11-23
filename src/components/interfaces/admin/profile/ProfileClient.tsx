"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
  Chip,
} from "@nextui-org/react";
import { AdminProfile } from "@/lib/types/profile";
import { Eye, EyeOff, Mail, Calendar, Key, ShieldCheck } from "lucide-react";
import BannerManagement from "./BannerManagement";

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      {/* Profile Overview */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Profile Overview</h2>
        </CardHeader>
        <CardBody className="gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar
                className="w-24 h-24 text-large"
                src={profile.avatar}
                showFallback
              />
              <Button size="sm" variant="flat" color="primary">
                Change Avatar
              </Button>
            </div>
            <div className="flex-grow space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-default-500">Administrator</p>
              </div>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-default-400" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-default-400" />
                  <span>Joined {formatDate(profile.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span className="text-success">Account Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-default-400" />
                  <span>Last login {formatDate(profile.lastLogin)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Security Settings</h2>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-default-400" />
                <h3 className="font-medium">Password</h3>
              </div>
              <p className="text-small text-default-500">
                Last changed {formatDate(profile.lastLogin)}
              </p>
            </div>
            <Button
              color="primary"
              variant="flat"
              onPress={onOpen}
              className="w-full sm:w-auto"
            >
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Banner Management */}
      <BannerManagement />

      {/* Change Password Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Change Password</ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    placeholder="Enter current password"
                    type={isVisible ? "text" : "password"}
                    value={currentPassword}
                    onValueChange={setCurrentPassword}
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
                    placeholder="Enter new password"
                    type={isVisible ? "text" : "password"}
                    value={newPassword}
                    onValueChange={setNewPassword}
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
                    placeholder="Confirm new password"
                    type={isVisible ? "text" : "password"}
                    value={confirmPassword}
                    onValueChange={setConfirmPassword}
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
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handlePasswordChange}>
                  Change Password
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
