import {
  ProductFilters,
  ProductVariantCreate,
  ProductWithRelations,
} from "@/types/product";
import { prisma } from "@/utils/prisma";
import { Prisma, Product } from "@prisma/client";

const defaultProductInclude = {
  category: true,
  variants: true,
  _count: {
    select: { reviews: true },
  },
} as const;

export const productsService = {
  async create(data: {
    name: string;
    description: string;
    categoryId: string;
    images: string[];
    variants: ProductVariantCreate[];
  }) {
    try {
      return await prisma.product.create({
        data: {
          ...data,
          variants: {
            create: data.variants,
          },
        },
        include: defaultProductInclude,
      });
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async getAll(filters: ProductFilters = {}) {
    try {
      const where: Prisma.ProductWhereInput = {};

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ];
      }

      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }

      if (filters.isNew !== undefined) {
        where.isNew = filters.isNew;
      }

      if (filters.size) {
        where.variants = {
          some: { size: filters.size },
        };
      }

      if (filters.minPrice || filters.maxPrice) {
        where.variants = {
          some: {
            AND: [
              filters.minPrice ? { price: { gte: filters.minPrice } } : {},
              filters.maxPrice ? { price: { lte: filters.maxPrice } } : {},
            ],
          },
        };
      }

      const products = await prisma.product.findMany({
        where,
        include: defaultProductInclude,
        orderBy: {
          createdAt: "desc",
        },
      });

      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<ProductWithRelations | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          ...defaultProductInclude,
          reviews: {
            include: {
              profile: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  async update(
    id: string,
    data: Partial<Product> & {
      variants?: {
        create?: ProductVariantCreate[];
        update?: Array<{
          where: { id: string };
          data: ProductVariantCreate;
        }>;
        deleteMany?: {
          id: { in: string[] };
        };
      };
    }
  ) {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          ...data,
          variants: data.variants,
        },
        include: defaultProductInclude,
      });
      return product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  async getNewArrivals(limit: number = 4) {
    try {
      return await prisma.product.findMany({
        where: {
          isNew: true,
        },
        include: defaultProductInclude,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      throw error;
    }
  },
};
