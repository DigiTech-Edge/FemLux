"use client";

import React from "react";
import {
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Drawer as NextUIDrawer,
} from "@nextui-org/react";
import { cn } from "@/helpers/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  placement?: "left" | "right";
  size?: "sm" | "md" | "lg";
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  title?: string;
}

const drawerSizes = {
  sm: "xs",
  md: "sm",
  lg: "md",
} as const;

export default function Drawer({
  isOpen,
  onClose,
  children,
  placement = "left",
  size = "sm",
  header,
  footer,
  className,
  title,
}: DrawerProps) {
  return (
    <NextUIDrawer
      isOpen={isOpen}
      onClose={onClose}
      placement={placement}
      size={drawerSizes[size]}
      radius="none"
      classNames={{
        base: cn("bg-background", className),
        header: "border-b",
        footer: "border-t",
      }}
      hideCloseButton={!!header}
    >
      <DrawerContent>
        {header ? (
          <div className="p-4 border-b">{header}</div>
        ) : (
          <DrawerHeader className="flex justify-between items-center">
            <span className="font-medium">{title}</span>
          </DrawerHeader>
        )}

        <DrawerBody className="p-4">{children}</DrawerBody>

        {footer && <DrawerFooter className="w-full justify-between">{footer}</DrawerFooter>}
      </DrawerContent>
    </NextUIDrawer>
  );
}
