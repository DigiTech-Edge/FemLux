import { Category, Product, ProductVariant, Review } from "@prisma/client";

// Type for variant with number price (used in client)
export type ProductVariantWithNumber = Omit<ProductVariant, "price"> & {
  price: number;
};

// Type for product with number prices (used in client)
export type ProductWithNumber = Omit<Product, "variants"> & {
  variants: ProductVariantWithNumber[];
};

export type ProductVariantCreate = {
  size: string;
  price: number;
  stock: number;
};

export type ProductVariantUpdate = ProductVariantCreate & {
  id: string;
};

export type ProductWithRelations = Omit<Product, "variants"> & {
  category: Category;
  variants: ProductVariantWithNumber[];
  _count: {
    reviews: number;
  };
  reviews?: Array<
    Review & {
      profile: {
        fullName: string | null;
        avatarUrl: string | null;
      };
    }
  >;
};

export type ProductFilters = {
  search?: string;
  categoryId?: string;
  isNew?: boolean;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type ProductFormData = {
  name: string;
  description: string;
  categoryId: string;
  images: string[];
  variants: ProductVariantCreate[];
  isNew?: boolean;
};

export type ProductUpdateData = Omit<Partial<ProductFormData>, 'variants'> & {
  id: string;
  isNew?: boolean;
  variants?: {
    create?: ProductVariantCreate[];
    update?: ProductVariantUpdate[];
    delete?: string[];
  };
};
