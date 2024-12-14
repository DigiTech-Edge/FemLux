"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  buttonText?: string;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  loading = false,
  buttonText = "Delete",
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? undefined : onClose}
      isDismissable={!loading}
      hideCloseButton={loading}
      backdrop="blur"
      placement="center"
      classNames={{
        backdrop:
          "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center">
          <AlertTriangle className="w-5 h-5 text-danger" />
          <span>{title}</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-default-500">{description}</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            color="danger"
            variant="flat"
            onPress={onConfirm}
            isLoading={loading}
          >
            {buttonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
