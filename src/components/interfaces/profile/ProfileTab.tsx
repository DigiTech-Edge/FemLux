"use client";

import React from "react";
import { Input, Button, Card, CardBody } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Profile, profileSchema, ProfileFormData } from "@/types/profile";
import { motion } from "framer-motion";
import { Edit2, Mail, User, Calendar } from "lucide-react";

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
        <div>
          <h2 className="text-2xl font-bold">Profile Information</h2>
          <p className="text-default-500">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button
            color="primary"
            variant="flat"
            startContent={<Edit2 className="w-4 h-4" />}
            onPress={() => setIsEditing(true)}
            size="lg"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <Card className="shadow-md">
        <CardBody className="p-6">
          {isEditing ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Full Name"
                {...form.register("name")}
                errorMessage={form.formState.errors.name?.message}
                isInvalid={!!form.formState.errors.name}
                isRequired
                isDisabled={isLoading}
                size="lg"
                startContent={<User className="w-4 h-4 text-default-400" />}
                classNames={{
                  input: "text-medium",
                }}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="light"
                  onPress={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                  isDisabled={isLoading}
                  size="lg"
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isLoading}
                  size="lg"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-small font-medium text-default-500">
                    Full Name
                  </p>
                  <p className="text-large font-semibold">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-slate-900/20">
                  <Mail className="w-5 h-5 text-slate-900" />
                </div>
                <div className="flex-1">
                  <p className="text-small font-medium text-default-500">
                    Email Address
                  </p>
                  <p className="text-large font-semibold">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/10">
                  <Calendar className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="text-small font-medium text-default-500">
                    Member Since
                  </p>
                  <p className="text-large font-semibold">
                    {new Date(profile.dateJoined).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
}
