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
      // First, validate that the product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: {
            include: {
              orderItems: true,
            },
          },
        },
      });

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      // Prepare the base update data
      const updateData: Prisma.ProductUpdateInput = {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.categoryId && {
          category: { connect: { id: data.categoryId } },
        }),
        ...(data.images && { images: data.images }),
        ...(typeof data.isNew === "boolean" && { isNew: data.isNew }),
      };

      // Handle variants update
      if (data.variants) {
        const variants = data.variants;

        // Handle variants marked for deletion
        if (Array.isArray(variants.delete) && variants.delete.length > 0) {
          const variantsToDelete = existingProduct.variants.filter((v) =>
            variants.delete?.includes(v.id)
          );

          // Check if any variants to be deleted have matching sizes in create
          const deleteSizes = variantsToDelete.map((v) => v.size);
          const createSizes = variants.create?.map((v) => v.size) || [];
          const matchingSizes = deleteSizes.filter((size) =>
            createSizes.includes(size)
          );

          if (matchingSizes.length > 0) {
            // Convert delete+create to update for matching sizes
            const updatedVariants = variantsToDelete
              .filter((v) => matchingSizes.includes(v.size))
              .map((v) => {
                const newData = variants.create?.find((c) => c.size === v.size);
                return {
                  id: v.id,
                  size: v.size,
                  price: newData?.price || 0,
                  stock: newData?.stock || 0,
                };
              });

            variants.update = [...(variants.update || []), ...updatedVariants];
            variants.create = variants.create?.filter(
              (v) => !matchingSizes.includes(v.size)
            );
            variants.delete = variants.delete.filter(
              (id) =>
                !variantsToDelete.some(
                  (v) => v.id === id && matchingSizes.includes(v.size)
                )
            );
          }

          // For variants with orders, set stock to 0 instead of deleting
          const variantsWithOrders = variantsToDelete.filter(
            (v) => v.orderItems.length > 0
          );
          if (variantsWithOrders.length > 0) {
            const deactivateVariants = variantsWithOrders.map((v) => ({
              id: v.id,
              size: v.size,
              price: Number(v.price),
              stock: 0,
            }));
            variants.update = [
              ...(variants.update || []),
              ...deactivateVariants,
            ];
            variants.delete = variants.delete.filter(
              (id) => !variantsWithOrders.some((v) => v.id === id)
            );
          }

          // Delete variants that have no orders
          if (variants.delete.length > 0) {
            await prisma.productVariant.deleteMany({
              where: {
                id: { in: variants.delete },
                productId: id,
              },
            });
          }
        }

        // Get fresh list of variants after deletion
        const existingVariants = await prisma.productVariant.findMany({
          where: {
            productId: id,
            id: { notIn: variants.update?.map((v) => v.id) || [] },
          },
        });

        // Check for duplicate sizes
        const existingSizes = existingVariants.map((v) => v.size);
        const newSizes = variants.create?.map((v) => v.size) || [];
        const updatedSizes = variants.update?.map((v) => v.size) || [];
        const allSizes = [...newSizes, ...updatedSizes, ...existingSizes];
        const uniqueSizes = new Set(allSizes);

        if (allSizes.length !== uniqueSizes.size) {
          throw new Error(
            "Duplicate sizes are not allowed for the same product"
          );
        }

        // Handle updates
        if (Array.isArray(variants.update) && variants.update.length > 0) {
          for (const variant of variants.update) {
            await prisma.productVariant.update({
              where: { id: variant.id },
              data: {
                size: variant.size,
                price: new Prisma.Decimal(variant.price),
                stock: variant.stock,
              },
            });
          }
        }

        // Create new variants
        if (Array.isArray(variants.create) && variants.create.length > 0) {
          await prisma.productVariant.createMany({
            data: variants.create.map((variant) => ({
              productId: id,
              size: variant.size,
              price: new Prisma.Decimal(variant.price),
              stock: variant.stock,
            })),
          });
        }
      }

      // Update the product and return with all relations
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error(
            "A variant with this size already exists for this product"
          );
        }
      }
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
