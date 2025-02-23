import { prisma } from "@/utils/prisma";

const defaultCategoryInclude = {
  _count: {
    select: { products: true },
  },
} as const;

export const categoriesService = {
  /**
   * Create a new category
   */
  async create(data: { name: string; description?: string; image?: string }) {
    try {
      return await prisma.category.create({
        data,
        include: defaultCategoryInclude,
      });
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  /**
   * Get all categories
   */
  async getAll() {
    try {
      return await prisma.category.findMany({
        where: {
          isActive: true,
          deletedAt: null,
        },
        include: defaultCategoryInclude,
        orderBy: {
          name: "asc",
        },
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  /**
   * Get a category by ID
   */
  async getById(id: string) {
    try {
      return await prisma.category.findUnique({
        where: {
          id,
          isActive: true,
          deletedAt: null,
        },
        include: {
          ...defaultCategoryInclude,
          products: {
            where: {
              isActive: true,
              deletedAt: null,
            },
            include: {
              variants: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  /**
   * Update a category
   */
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      image?: string;
    }
  ) {
    try {
      return await prisma.category.update({
        where: { id },
        data,
        include: defaultCategoryInclude,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  /**
   * Delete a category
   */
  async delete(id: string) {
    try {
      // Check if category has any products
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: {
            include: {
              variants: {
                include: {
                  orderItems: true,
                },
              },
            },
          },
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      const hasProductsWithOrders = category.products.some((product) =>
        product.variants.some((variant) => variant.orderItems.length > 0)
      );

      if (hasProductsWithOrders) {
        // Soft delete if category has products with orders
        await prisma.category.update({
          where: { id },
          data: {
            isActive: false,
            deletedAt: new Date(),
            products: {
              updateMany: {
                where: {
                  categoryId: id,
                },
                data: {
                  isActive: false,
                  deletedAt: new Date(),
                },
              },
            },
          },
        });
      } else {
        // Hard delete if no products with orders
        await prisma.category.delete({
          where: { id },
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
