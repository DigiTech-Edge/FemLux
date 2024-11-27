import { OrderStatus } from "@prisma/client";
import { Package, X, Truck, CheckCheck } from "lucide-react";

export interface StatusAction {
  key: OrderStatus;
  label: string;
  color: "primary" | "danger" | "success";
  icon: typeof Package | typeof X | typeof Truck | typeof CheckCheck;
}

export function getStatusActions(currentStatus: OrderStatus): StatusAction[] {
  switch (currentStatus) {
    case OrderStatus.PENDING:
      return [
        {
          key: OrderStatus.PROCESSING,
          label: "Process Order",
          color: "primary",
          icon: Package,
        },
        {
          key: OrderStatus.CANCELLED,
          label: "Cancel Order",
          color: "danger",
          icon: X,
        },
      ];
    case OrderStatus.PROCESSING:
      return [
        {
          key: OrderStatus.SHIPPED,
          label: "Ship Order",
          color: "primary",
          icon: Truck,
        },
        {
          key: OrderStatus.CANCELLED,
          label: "Cancel Order",
          color: "danger",
          icon: X,
        },
      ];
    case OrderStatus.SHIPPED:
      return [
        {
          key: OrderStatus.DELIVERED,
          label: "Mark as Delivered",
          color: "success",
          icon: CheckCheck,
        },
      ];
    default:
      return [];
  }
}
