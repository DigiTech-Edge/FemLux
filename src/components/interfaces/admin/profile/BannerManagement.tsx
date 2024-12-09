"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Switch,
  Image,
  Chip,
  Divider,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BannerWithId } from "@/types/banner";
import {
  PlusIcon,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Calendar,
  X,
} from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import toast from "react-hot-toast";
import {
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
  toggleBannerStatusAction,
} from "@/services/actions/banner.actions";
import { deleteImage } from "@/utils/supabase/storage";
import env from "@/env";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image is required"),
  isActive: z.boolean().default(true),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerManagementProps {
  initialBanner: BannerWithId | null;
}

export default function BannerManagement({
  initialBanner,
}: BannerManagementProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [banner, setBanner] = useState<BannerWithId | null>(initialBanner);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteImageState, setDeleteImageState] = useState({
    isOpen: false,
    loading: false,
  });
  const [deleteBannerState, setDeleteBannerState] = useState({
    isOpen: false,
    loading: false,
  });

  const form = useForm<BannerFormData>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (banner) {
      form.reset({
        title: banner.title,
        description: banner.description,
        imageUrl: banner.imageUrl,
        isActive: banner.isActive,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        imageUrl: "",
        isActive: true,
      });
    }
  }, [banner, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const handleImageChange = (urls: string[]) => {
    const imageUrl = urls[0] || "";
    form.setValue("imageUrl", imageUrl);
  };

  const handleImageRemove = async () => {
    if (!form.getValues("imageUrl")) return;

    try {
      setDeleteImageState((prev) => ({ ...prev, loading: true }));
      await deleteImage(form.getValues("imageUrl"));
      form.setValue("imageUrl", "");
      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
    } finally {
      setDeleteImageState((prev) => ({
        ...prev,
        loading: false,
        isOpen: false,
      }));
    }
  };

  const handleBannerDelete = async () => {
    if (!banner) return;

    try {
      setDeleteBannerState((prev) => ({ ...prev, loading: true }));
      await deleteImage(banner.imageUrl);
      await deleteBannerAction(banner.id);
      setBanner(null);
      toast.success("Banner deleted successfully");
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error(error);
    } finally {
      setDeleteBannerState((prev) => ({
        ...prev,
        loading: false,
        isOpen: false,
      }));
    }
  };

  const handleAddNewBanner = () => {
    setBanner(null);
    form.reset({
      title: "",
      description: "",
      imageUrl: "",
      isActive: true,
    });
    onOpen();
  };

  const onSubmit = async (data: BannerFormData) => {
    try {
      setIsLoading(true);

      if (banner) {
        const updatedBanner = await updateBannerAction(banner.id, data);
        setBanner(updatedBanner);
        toast.success("Banner updated successfully");
      } else {
        const newBanner = await createBannerAction(data);
        setBanner(newBanner);
        toast.success("Banner created successfully");
      }

      handleClose();
    } catch (error) {
      toast.error("Failed to save banner");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!banner) return;

    try {
      setIsLoading(true);
      const updatedBanner = await toggleBannerStatusAction(banner.id);
      setBanner(updatedBanner);
      toast.success("Banner status updated successfully");
    } catch (error) {
      console.error("Error updating banner status:", error);
      toast.error("Failed to update banner status");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Banner Management</h2>
          <p className="text-small text-default-500">
            Manage your website banners and promotional content
          </p>
        </div>
        <Button
          color="primary"
          endContent={<PlusIcon className="w-4 h-4" />}
          onPress={handleAddNewBanner}
          size="sm"
          isDisabled={isLoading}
        >
          Add New Banner
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="gap-6">
        {!banner ? (
          <div className="text-center py-6">
            <ImageIcon className="w-12 h-12 mx-auto text-default-300 mb-4" />
            <p className="text-default-500">No banner yet</p>
            <p className="text-small text-default-400">
              Add your first banner to get started
            </p>
          </div>
        ) : (
          <Card className="w-full">
            <CardBody className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full sm:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-grow space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold">{banner.title}</h3>
                      {banner.description && (
                        <p className="text-sm text-default-500 mt-1">
                          {banner.description}
                        </p>
                      )}
                    </div>
                    <Chip
                      color={banner.isActive ? "success" : "default"}
                      variant="flat"
                      size="sm"
                    >
                      {banner.isActive ? "Active" : "Inactive"}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-2 text-small text-default-500">
                    <Calendar className="w-4 h-4" />
                    <span>Created {formatDate(banner.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        size="sm"
                        isSelected={banner.isActive}
                        onValueChange={handleToggleStatus}
                        isDisabled={isLoading}
                      />
                      <span className="text-small">
                        {banner.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onPress={onOpen}
                        startContent={<Pencil className="w-4 h-4" />}
                        isDisabled={isLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        onPress={() =>
                          setDeleteBannerState((prev) => ({
                            ...prev,
                            isOpen: true,
                          }))
                        }
                        startContent={<Trash2 className="w-4 h-4" />}
                        isDisabled={isLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        <Modal
          isOpen={isOpen}
          onClose={handleClose}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {() => (
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h2>{banner ? "Edit Banner" : "Add New Banner"}</h2>
                  </div>
                </ModalHeader>
                <Divider />
                <ModalBody>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Input
                        label="Banner Title"
                        placeholder="Enter banner title"
                        {...form.register("title")}
                        errorMessage={form.formState.errors.title?.message}
                        isInvalid={!!form.formState.errors.title}
                        isRequired
                        isDisabled={isLoading}
                      />
                      <Textarea
                        label="Banner Description"
                        placeholder="Enter banner description"
                        {...form.register("description")}
                        errorMessage={
                          form.formState.errors.description?.message
                        }
                        isInvalid={!!form.formState.errors.description}
                        isRequired
                        isDisabled={isLoading}
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          {...form.register("isActive")}
                          isSelected={form.watch("isActive")}
                          onValueChange={(value) =>
                            form.setValue("isActive", value)
                          }
                          isDisabled={isLoading}
                        />
                        <span>Active</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Banner Image
                      </label>
                      {form.watch("imageUrl") ? (
                        <div className="relative w-full aspect-square border rounded-lg overflow-hidden">
                          <Image
                            src={form.watch("imageUrl")}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                           <button
                          type="button"
                          onClick={() =>
                            setDeleteImageState((prev) => ({
                              ...prev,
                              isOpen: true,
                            }))
                          }
                          className="absolute top-2 z-10 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors"
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
                      {form.formState.errors.imageUrl && (
                        <p className="text-danger text-sm">
                          {form.formState.errors.imageUrl.message}
                        </p>
                      )}
                    </div>
                  </div>
                </ModalBody>
                <Divider />
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={handleClose}
                    isDisabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    {banner ? "Save Changes" : "Add Banner"}
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>

        <DeleteConfirmationModal
          isOpen={deleteImageState.isOpen}
          onClose={() =>
            setDeleteImageState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={handleImageRemove}
          title="Delete Image"
          description="Are you sure you want to delete this image? This action cannot be undone."
          loading={deleteImageState.loading}
        />

        <DeleteConfirmationModal
          isOpen={deleteBannerState.isOpen}
          onClose={() =>
            setDeleteBannerState((prev) => ({ ...prev, isOpen: false }))
          }
          onConfirm={handleBannerDelete}
          title="Delete Banner"
          description="Are you sure you want to delete this banner? This action cannot be undone."
          loading={deleteBannerState.loading}
        />
      </CardBody>
    </Card>
  );
}
