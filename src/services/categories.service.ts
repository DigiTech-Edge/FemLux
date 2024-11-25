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
        where: { id },
        include: {
          ...defaultCategoryInclude,
          products: {
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
      return await prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
