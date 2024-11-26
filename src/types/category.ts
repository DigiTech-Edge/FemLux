import { Category } from "@prisma/client";

export interface CategoryWithCount extends Category {
  _count: {
    products: number;
  };
}

export type CategoryFormData = {
  name: string;
  description?: string;
  image?: string;
};
