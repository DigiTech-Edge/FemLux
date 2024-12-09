"use client";

import { useState } from "react";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Skeleton,
  Spinner,
} from "@nextui-org/react";
import { PencilIcon, Trash2Icon } from "lucide-react";
import useSWR from "swr";
import { createClient } from "@/utils/supabase/client";
import {
  updateAvatarUrlAction,
  deleteAvatarAction,
  fetchAvatarUrlAction,
} from "@/services/actions/profile.actions";
import ImageUpload from "@/components/ui/ImageUpload";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import toast from "react-hot-toast";
import env from "@/env";
import { deleteImage } from "@/utils/supabase/storage";

interface UserAvatarProps {
  showEditButton?: boolean;
  className?: string;
}

const fetcher = async () => {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("No session");

  if (session.user.app_metadata.provider === "google") {
    return {
      avatarUrl: session.user.user_metadata.avatar_url,
      isGoogleAuth: true,
    };
  }

  // For non-Google auth, fetch avatar from profile using server action
  const avatarUrl = await fetchAvatarUrlAction();

  return {
    avatarUrl,
    isGoogleAuth: false,
  };
};

export default function UserAvatar({
  showEditButton = false,
  className = "h-10 w-10",
}: UserAvatarProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data, mutate, isLoading } = useSWR("userAvatar", fetcher);
  const isGoogleAuth = data?.isGoogleAuth;
  const avatarUrl = data?.avatarUrl;

  const handleImageChange = async (urls: string[]) => {
    if (!urls.length) return;

    try {
      setIsUploading(true);
      const newAvatarUrl = urls[0];
      await updateAvatarUrlAction(newAvatarUrl);
      await mutate();
      toast.success("Avatar updated successfully");
      setShowUpload(false);
    } catch (error) {
      toast.error("Failed to update avatar");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      setIsDeleting(true);
      const urlToDelete = await deleteAvatarAction();
      if (urlToDelete) {
        await deleteImage(urlToDelete);
      }
      await mutate();
      toast.success("Avatar deleted successfully");
      setShowDeleteConfirm(false);
      setShowUpload(false);
    } catch (error) {
      toast.error("Failed to delete avatar");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <Skeleton className={`rounded-full ${className}`} />;
  }

  return (
    <div className="relative inline-block">
      <Avatar src={avatarUrl || undefined} className={className} showFallback />

      {showEditButton && !isGoogleAuth && (
        <div className="absolute -bottom-1 -right-1">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            className="bg-background border-1 border-default-200 dark:border-default-100"
            onPress={() => setShowUpload(true)}
          >
            <PencilIcon className="h-3 w-3" />
          </Button>
        </div>
      )}

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} size="md">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex justify-between items-center">
                <span>Update Avatar</span>
                {avatarUrl && (
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => setShowDeleteConfirm(true)}
                    isDisabled={isUploading}
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                )}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar
                      src={avatarUrl || undefined}
                      className="w-24 h-24"
                      showFallback
                    />
                  </div>
                  {isUploading ? (
                    <div className="flex justify-center items-center h-[140px]">
                      <Spinner size="lg" />
                    </div>
                  ) : (
                    <ImageUpload
                      value={[]}
                      onChange={handleImageChange}
                      bucket={env.buckets.users}
                      maxFiles={1}
                      maxFileSize={1 * 1024 * 1024}
                    />
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={() => setShowUpload(false)}
                  isDisabled={isUploading}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAvatar}
        title="Delete Avatar"
        description="Are you sure you want to delete your avatar? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
