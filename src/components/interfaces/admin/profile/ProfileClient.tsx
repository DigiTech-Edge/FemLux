"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider,
} from "@nextui-org/react";
import { Profile } from "@/types/profile";
import { Eye, EyeOff, Mail, Key, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { updatePasswordAction } from "@/services/actions/profile.actions";
import UserAvatar from "@/components/shared/UserAvatar";

interface ProfileClientProps {
  profile: Profile;
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await updatePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success("Password updated successfully");
      onClose();
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error("Failed to update password");
      console.error("Error updating password:", error);
    } finally {
      setIsLoading(false);
    }
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
            <UserAvatar showEditButton className="w-24 h-24" />
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
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <span className="text-success">Account Active</span>
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
                Change your password to keep your account secure
              </p>
            </div>
            <Button
              color="primary"
              variant="flat"
              onPress={onOpen}
              className="w-full sm:w-auto"
              isDisabled={isLoading}
            >
              Change Password
            </Button>
          </div>
        </CardBody>
      </Card>

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
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handlePasswordChange}
                  isLoading={isLoading}
                >
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
