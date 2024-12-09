"use client";

import { useEffect, useState } from "react";
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
  Textarea,
  Switch,
  Chip,
  Divider,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BannerWithId } from "@/types/banner";
import { PlusIcon, Pencil, Trash2, Image as ImageIcon, X } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import toast from "react-hot-toast";
import {
  createBannerAction,
  updateBannerAction,
  deleteBannerAction,
  toggleBannerStatusAction,
} from "@/services/actions/banner.actions";
import { deleteImage } from "@/utils/supabase/storage";
import env from "@/env";
import { Image } from "@nextui-org/react";

const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().min(1, "Image is required"),
  isActive: z.boolean().default(true),
});

type BannerFormData = z.infer<typeof bannerSchema>;

interface BannerManagementProps {
  initialBanners: BannerWithId[];
}

export default function BannerManagement({
  initialBanners,
}: BannerManagementProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [banners, setBanners] = useState<BannerWithId[]>(initialBanners);
  const [selectedBanner, setSelectedBanner] = useState<BannerWithId | null>(null);
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
    if (selectedBanner) {
      form.reset({
        title: selectedBanner.title,
        description: selectedBanner.description,
        imageUrl: selectedBanner.imageUrl,
        isActive: selectedBanner.isActive,
      });
    } else {
      form.reset({
        title: "",
        description: "",
        imageUrl: "",
        isActive: true,
      });
    }
  }, [selectedBanner, form]);

  const handleClose = () => {
    setSelectedBanner(null);
    form.reset();
    onClose();
  };

  const handleToggleStatus = async (banner: BannerWithId) => {
    try {
      setIsLoading(true);
      const updatedBanner = await toggleBannerStatusAction(banner.id);
      setBanners(prev => prev.map(b => b.id === banner.id ? updatedBanner : b));
      toast.success("Banner status updated successfully");
    } catch (error) {
      toast.error("Failed to update banner status");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerDelete = async () => {
    if (!selectedBanner) return;
    
    try {
      setDeleteBannerState(prev => ({ ...prev, loading: true }));
      await deleteImage(selectedBanner.imageUrl);
      await deleteBannerAction(selectedBanner.id);
      setBanners(prev => prev.filter(b => b.id !== selectedBanner.id));
      toast.success("Banner deleted successfully");
      setDeleteBannerState(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error("Failed to delete banner");
      console.error(error);
    } finally {
      setDeleteBannerState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleAddNewBanner = () => {
    setSelectedBanner(null);
    onOpen();
  };

  const onSubmit = async (data: BannerFormData) => {
    try {
      setIsLoading(true);

      if (selectedBanner) {
        const updatedBanner = await updateBannerAction(selectedBanner.id, data);
        setBanners(prev => prev.map(b => b.id === selectedBanner.id ? updatedBanner : b));
        toast.success("Banner updated successfully");
      } else {
        const newBanner = await createBannerAction(data);
        setBanners(prev => [...prev, newBanner]);
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

  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
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
        </div>

        <Divider className="my-4" />

        <div className="space-y-4">
          {banners.length === 0 ? (
            <div className="text-center py-6">
              <ImageIcon className="w-12 h-12 mx-auto text-default-300 mb-4" />
              <p className="text-default-500">No banners yet</p>
              <p className="text-small text-default-400">
                Add your first banner to get started
              </p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="relative">
                <Card shadow="none" className="border-none bg-default-50">
                  <CardBody className="gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="space-y-1">
                          <h3 className="text-small font-medium">{banner.title}</h3>
                          <p className="text-tiny text-default-500">
                            {banner.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          size="sm"
                          isSelected={banner.isActive}
                          onValueChange={() => handleToggleStatus(banner)}
                          isDisabled={isLoading}
                        />
                        <Chip
                          color={banner.isActive ? "success" : "danger"}
                          size="sm"
                          variant="flat"
                        >
                          {banner.isActive ? "Active" : "Inactive"}
                        </Chip>
                        <Button
                          variant="flat"
                          color="primary"
                          onPress={() => {
                            setSelectedBanner(banner);
                            onOpen();
                          }}
                          startContent={<Pencil className="w-4 h-4" />}
                          isDisabled={isLoading}
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="flat"
                          color="danger"
                          onPress={() => {
                            setSelectedBanner(banner);
                            setDeleteBannerState(prev => ({ ...prev, isOpen: true }));
                          }}
                          startContent={<Trash2 className="w-4 h-4" />}
                          isDisabled={isLoading}
                          size="sm"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                    {banner.imageUrl && (
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </CardBody>
                </Card>
              </div>
            ))
          )}
        </div>

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
                    <h2>
                      {selectedBanner ? "Edit Banner" : "Add New Banner"}
                    </h2>
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
                          onChange={(urls) => {
                            const imageUrl = urls[0] || "";
                            form.setValue("imageUrl", imageUrl);
                          }}
                          onRemove={handleImageRemove}
                          bucket={env.buckets.categories}
                          maxFiles={1}
                          maxFileSize={1 * 1024 * 1024}
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
                    {selectedBanner ? "Save Changes" : "Add Banner"}
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
          onClose={() => setDeleteBannerState(prev => ({ ...prev, isOpen: false }))}
          onConfirm={handleBannerDelete}
          title="Delete Banner"
          description="Are you sure you want to delete this banner? This action cannot be undone."
          loading={deleteBannerState.loading}
        />
      </CardBody>
    </Card>
  );
}
