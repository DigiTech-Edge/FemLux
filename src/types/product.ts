import {
  Category,
  Product as PrismaProduct,
  ProductVariant,
  Review,
} from "@prisma/client";

export type { PrismaProduct as Product };

// Type for variant with number price (used in client)
export type ProductVariantWithNumber = Omit<ProductVariant, "price"> & {
  price: number;
};

// Type for product with number prices (used in client)
export type ProductWithNumber = Omit<PrismaProduct, "variants"> & {
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

export type ProductWithRelations = Omit<PrismaProduct, "variants"> & {
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
  categories?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  isNew?: boolean;
};

export type ProductVariantFormData = {
  id?: string;
  size: string;
  price: number;
  stock: number;
};

export type ProductFormData = {
  name: string;
  description: string;
  categoryId: string;
  images: string[];
  variants: ProductVariantFormData[];
  isNew?: boolean;
};

export type ProductUpdateData = Omit<Partial<ProductFormData>, "variants"> & {
  id: string;
  isNew?: boolean;
  variants?: {
    create?: ProductVariantCreate[];
    update?: ProductVariantUpdate[];
    delete?: string[];
  };
};

export type ProductStats = {
  totalProducts: number;
  totalValue: number;
  lowStock: number;
  outOfStock: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
};
