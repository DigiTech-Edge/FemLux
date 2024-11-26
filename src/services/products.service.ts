import {
  ProductFilters,
  ProductFormData,
  ProductUpdateData,
  ProductWithRelations,
} from "@/types/product";
import { prisma } from "@/utils/prisma";
import { Prisma } from "@prisma/client";

const defaultProductInclude = {
  category: true,
  variants: true,
  _count: {
    select: { reviews: true },
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

      // Convert Decimal to number for serialization
      return products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
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

      // Convert Decimal to number for serialization
      return products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
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

      if (!product) return null;

      // Convert Decimal to number for serialization
      return {
        ...product,
        variants: product.variants.map((variant) => ({
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
      // Convert number to Prisma.Decimal for database
      const result = await prisma.product.create({
        data: {
          name: data.name,
          description: data.description,
          categoryId: data.categoryId,
          images: data.images,
          isNew: data.isNew,
          variants: {
            create: data.variants.map((variant) => ({
              size: variant.size,
              price: new Prisma.Decimal(variant.price),
              stock: variant.stock,
            })),
          },
        },
        include: defaultProductInclude,
      });

      // Convert Decimal back to number for response
      return {
        ...result,
        variants: result.variants.map((variant) => ({
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
              size: variant.size,
              price: new Prisma.Decimal(variant.price),
              stock: variant.stock,
            })),
          }),
          ...(data.variants.update && {
            update: data.variants.update.map((variant) => ({
              where: { id: variant.id },
              data: {
                size: variant.size,
                price: new Prisma.Decimal(variant.price),
                stock: variant.stock,
              },
            })),
          }),
          ...(data.variants.delete && {
            delete: data.variants.delete.map((id) => ({ id })),
          }),
        };
      }

      const result = await prisma.product.update({
        where: { id },
        data: updateData,
        include: defaultProductInclude,
      });

      // Convert Decimal back to number for response
      return {
        ...result,
        variants: result.variants.map((variant) => ({
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

      // Convert Decimal to number for serialization
      return products.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({
          ...variant,
          price: Number(variant.price),
        })),
      }));
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      throw error;
    }
  },
};
