"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, Input, Button } from "@nextui-org/react";
import { X } from "lucide-react";
import Image from "next/image";
import { BannerWithId } from "@/types/banner";
import ImageUpload from "@/components/ui/ImageUpload";
import env from "@/env";
import { deleteImage } from "@/utils/supabase/storage";
import toast from "react-hot-toast";
import {
  createBannerAction,
  updateBannerAction,
  toggleBannerStatusAction,
} from "@/services/actions/banner.actions";

interface BannerClientProps {
  banner: BannerWithId | null;
}

export default function BannerClient({ banner }: BannerClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(banner?.title || "");
  const [description, setDescription] = useState(banner?.description || "");

  const handleImageChange = async (urls: string[]) => {
    try {
      setIsLoading(true);
      const imageUrl = urls[0];

      if (banner) {
        await updateBannerAction(banner.id, {
          ...banner,
          imageUrl,
        });
      } else {
        await createBannerAction({
          title,
          description,
          imageUrl,
          isActive: true,
        });
      }

      toast.success("Banner image updated successfully");
    } catch (error) {
      toast.error("Failed to update banner image");
      console.error("Error updating banner image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageRemove = async () => {
    if (!banner?.imageUrl) return;

    try {
      setIsLoading(true);
      await deleteImage(banner.imageUrl);
      await updateBannerAction(banner.id, {
        ...banner,
        imageUrl: "",
      });
      toast.success("Banner image removed successfully");
    } catch (error) {
      toast.error("Failed to remove banner image");
      console.error("Error removing banner image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (banner) {
        await updateBannerAction(banner.id, {
          ...banner,
          title,
          description,
        });
      } else {
        await createBannerAction({
          title,
          description,
          imageUrl: "",
          isActive: true,
        });
      }

      toast.success("Banner updated successfully");
    } catch (error) {
      toast.error("Failed to update banner");
      console.error("Error updating banner:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!banner) return;

    try {
      setIsLoading(true);
      await toggleBannerStatusAction(banner.id);
      toast.success("Banner status updated successfully");
    } catch (error) {
      toast.error("Failed to update banner status");
      console.error("Error updating banner status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Banner Management</h2>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          {banner?.imageUrl ? (
            <div className="relative w-full aspect-video">
              <Image
                src={banner.imageUrl}
                alt="Banner image"
                fill
                className="object-cover rounded-lg"
              />
              <button
                onClick={handleImageRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
                disabled={isLoading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <ImageUpload
              value={[]}
              onChange={handleImageChange}
              onRemove={handleImageRemove}
              bucket={env.buckets.categories}
              maxFiles={1}
              maxFileSize={2 * 1024 * 1024}
            />
          )}
          <div className="space-y-4">
            <Input
              label="Banner Title"
              placeholder="Enter banner title"
              value={title}
              onValueChange={setTitle}
              labelPlacement="outside"
            />
            <Input
              label="Banner Description"
              placeholder="Enter banner description"
              value={description}
              onValueChange={setDescription}
              labelPlacement="outside"
            />
          </div>
          <div className="flex justify-between items-center pt-4">
            <Button color="primary" onPress={handleSave} isLoading={isLoading}>
              Save Changes
            </Button>
            {banner && (
              <Button
                color={banner.isActive ? "danger" : "success"}
                variant="flat"
                onPress={handleToggleStatus}
                isDisabled={isLoading}
              >
                {banner.isActive ? "Deactivate" : "Activate"} Banner
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
