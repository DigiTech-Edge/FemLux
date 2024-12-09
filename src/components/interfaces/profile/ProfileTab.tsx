"use client";

import React from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, profileSchema, ProfileFormData } from "@/types/profile";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

interface ProfileTabProps {
  profile: Profile;
  onUpdate: (data: ProfileFormData) => Promise<void>;
}

export default function ProfileTab({ profile, onUpdate }: ProfileTabProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      await onUpdate(data);
      setIsEditing(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        {!isEditing && (
          <Button
            color="primary"
            variant="flat"
            startContent={<Edit2 className="w-4 h-4" />}
            onPress={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardBody>
          {isEditing ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                {...form.register("name")}
                errorMessage={form.formState.errors.name?.message}
                isInvalid={!!form.formState.errors.name}
                isRequired
                isDisabled={isLoading}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="light"
                  onPress={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button color="primary" type="submit" isLoading={isLoading}>
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-small text-default-500">Full Name</p>
                <p className="text-medium">{profile.name}</p>
              </div>
              <div>
                <p className="text-small text-default-500">Email</p>
                <p className="text-medium">{profile.email}</p>
              </div>
              <div>
                <p className="text-small text-default-500">Member Since</p>
                <p className="text-medium">
                  {new Date(profile.dateJoined).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
