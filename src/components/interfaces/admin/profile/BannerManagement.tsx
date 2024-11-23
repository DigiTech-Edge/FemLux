"use client";

import { useState, useCallback } from "react";
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
} from "@nextui-org/react";
import { Banner } from "@/lib/types/banner";
import {
  PlusIcon,
  Pencil,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Upload,
  X,
} from "lucide-react";
import { mockBanners } from "@/lib/data/admin/banners";
import { useDropzone } from "react-dropzone";

export default function BannerManagement() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError("");
    const file = acceptedFiles[0];

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: 1,
  });

  const handleOpen = (banner?: Banner) => {
    setError("");
    if (banner) {
      setEditingBanner(banner);
      setTitle(banner.title);
      setMessage(banner.message || "");
      setImagePreview(banner.image);
      setActive(banner.active);
    } else {
      setEditingBanner(null);
      setTitle("");
      setMessage("");
      setImagePreview("");
      setImageFile(null);
      setActive(true);
    }
    onOpen();
  };

  const handleClose = () => {
    setEditingBanner(null);
    setTitle("");
    setMessage("");
    setImagePreview("");
    setImageFile(null);
    setActive(true);
    setError("");
    onClose();
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!imagePreview && !imageFile) {
      setError("Image is required");
      return;
    }

    const imageUrl = imageFile ? imagePreview : editingBanner?.image || "";

    if (editingBanner) {
      setBanners(
        banners.map((b) =>
          b.id === editingBanner.id
            ? {
                ...editingBanner,
                title,
                message: message.trim() || undefined,
                image: imageUrl,
                active,
              }
            : b
        )
      );
    } else {
      const newBanner: Banner = {
        id: Date.now().toString(),
        title,
        message: message.trim() || undefined,
        image: imageUrl,
        active,
        createdAt: new Date().toISOString(),
      };
      setBanners([...banners, newBanner]);
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    setBanners(banners.filter((b) => b.id !== id));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
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
          onPress={() => handleOpen()}
          size="sm"
        >
          Add Banner
        </Button>
      </CardHeader>
      <Divider />
      <CardBody className="gap-6">
        {banners.length === 0 ? (
          <div className="text-center py-6">
            <ImageIcon className="w-12 h-12 mx-auto text-default-300 mb-4" />
            <p className="text-default-500">No banners yet</p>
            <p className="text-small text-default-400">
              Add your first banner to get started
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <Card key={banner.id} className="w-full">
                <CardBody className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      className="w-full sm:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-grow space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {banner.title}
                          </h3>
                          {banner.message && (
                            <p className="text-sm text-default-500 mt-1">
                              {banner.message}
                            </p>
                          )}
                        </div>
                        <Chip
                          color={banner.active ? "success" : "default"}
                          variant="flat"
                          size="sm"
                        >
                          {banner.active ? "Active" : "Inactive"}
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
                            isSelected={banner.active}
                            onValueChange={(value) => {
                              setBanners(
                                banners.map((b) =>
                                  b.id === banner.id
                                    ? { ...b, active: value }
                                    : b
                                )
                              );
                            }}
                          />
                          <span className="text-small">
                            {banner.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            onPress={() => handleOpen(banner)}
                            startContent={<Pencil className="w-4 h-4" />}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            onPress={() => handleDelete(banner.id)}
                            startContent={<Trash2 className="w-4 h-4" />}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}

        <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-6">
                    <div>
                      <Input
                        label="Banner Title"
                        placeholder="Enter banner title"
                        value={title}
                        onValueChange={setTitle}
                        isRequired
                      />
                    </div>

                    <div>
                      <Input
                        label="Banner Message (Optional)"
                        placeholder="Enter promotional message"
                        value={message}
                        onValueChange={setMessage}
                        description="Add a catchy message to promote your content"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Banner Image
                      </label>
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            className="absolute top-2 right-2"
                            onPress={clearImage}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                            ${
                              isDragActive
                                ? "border-primary bg-primary/10"
                                : "border-default-300 hover:border-primary"
                            }`}
                        >
                          <input {...getInputProps()} />
                          <Upload className="w-8 h-8 mx-auto mb-4 text-default-400" />
                          {isDragActive ? (
                            <p>Drop the image here</p>
                          ) : (
                            <div>
                              <p className="text-default-700">
                                Drag and drop an image here, or click to select
                              </p>
                              <p className="text-sm text-default-400 mt-1">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch isSelected={active} onValueChange={setActive} />
                      <span>Active</span>
                    </div>

                    {error && <p className="text-danger text-sm">{error}</p>}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" onPress={handleSave}>
                    {editingBanner ? "Save Changes" : "Add Banner"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  );
}
