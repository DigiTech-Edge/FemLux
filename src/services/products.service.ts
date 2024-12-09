import {
  ProductFilters,
  ProductFormData,
  ProductUpdateData,
  ProductWithRelations,
} from "@/types/product";
import { prisma } from "@/utils/prisma";
import { Prisma, ProductVariant } from "@prisma/client";

const defaultProductInclude = {
  category: true,
  variants: true,
  _count: {
    select: { reviews: true },
  },
  reviews: {
    include: {
      profile: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  },
} as const;

export const productsService = {
  async getAll() {
    try {
      const products = await prisma.product.findMany({
        include: defaultProductInclude,
        orderBy: {
          createdAt: "desc",
        },
      });

      return products.map((product) => ({
        ...product,
        variants: product.variants.map((variant: ProductVariant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      }));
    } catch (error) {
      console.error("Error fetching all products:", error);
      throw error;
    }
  },

  async getFiltered(filters: ProductFilters = {}) {
    try {
      const where: Prisma.ProductWhereInput = {};

      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
          {
            category: {
              name: { contains: filters.search, mode: "insensitive" },
            },
          },
        ];
      }

      if (filters.categories?.length) {
        where.category = {
          name: { in: filters.categories },
        };
      }

      if (filters.priceRange) {
        where.variants = {
          some: {
            price: {
              gte: filters.priceRange.min,
              lte: filters.priceRange.max,
            },
          },
        };
      }

      if (filters.isNew !== undefined) {
        where.isNew = filters.isNew;
      }

      const products = await prisma.product.findMany({
        where,
        include: defaultProductInclude,
        orderBy: {
          createdAt: "desc",
        },
      });

      return products.map((product) => ({
        ...product,
        variants: product.variants.map((variant: ProductVariant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      }));
    } catch (error) {
      console.error("Error fetching filtered products:", error);
      throw error;
    }
  },

  async getById(id: string): Promise<ProductWithRelations | null> {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: defaultProductInclude,
      });

      if (!product) return null;

      return {
        ...product,
        variants: product.variants.map((variant: ProductVariant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      };
    } catch (error) {
      console.error("Error fetching product by id:", error);
      throw error;
    }
  },

  async create(data: ProductFormData) {
    try {
      const product = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          images: data.images,
          categoryId: data.categoryId,
          isNew: data.isNew,
          variants: {
            create: data.variants.map((variant) => ({
              ...variant,
              price: new Prisma.Decimal(variant.price),
            })),
          },
        },
        include: defaultProductInclude,
      });

      return {
        ...product,
        variants: product.variants.map((variant: ProductVariant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  async update(id: string, data: ProductUpdateData) {
    try {
      const updateData: Prisma.ProductUpdateInput = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.images && { images: data.images }),
        ...(data.isNew !== undefined && { isNew: data.isNew }),
      };

      if (data.variants) {
        updateData.variants = {
          ...(data.variants.create && {
            create: data.variants.create.map((variant) => ({
              ...variant,
              price: new Prisma.Decimal(variant.price),
            })),
          }),
          ...(data.variants.update && {
            update: data.variants.update.map((variant) => ({
              where: { id: variant.id },
              data: {
                ...variant,
                price: new Prisma.Decimal(variant.price),
              },
            })),
          }),
          ...(data.variants.delete && {
            delete: data.variants.delete.map((id) => ({ id })),
          }),
        };
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
        include: defaultProductInclude,
      });

      return {
        ...product,
        variants: product.variants.map((variant: ProductVariant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      await prisma.product.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  async getNewArrivals(limit: number = 4) {
    try {
      const products = await prisma.product.findMany({
        where: {
          isNew: true,
        },
        include: defaultProductInclude,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      return products.map((product) => ({
        ...product,
        variants: product.variants.map((variant: ProductVariant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      }));
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      throw error;
    }
  },

  async addReview(data: {
    productId: string;
    rating: number;
    comment: string;
    userId: string;
  }) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId: data.userId },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      const review = await prisma.review.create({
        data: {
          productId: data.productId,
          userId: profile.id,
          rating: data.rating,
          comment: data.comment,
        },
        include: {
          profile: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      });

      return review;
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },
};
