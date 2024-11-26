"use server";

import { categoriesService } from "../categories.service";

export async function getCategories() {
  return categoriesService.getAll();
}

export async function getCategoryById(id: string) {
  return categoriesService.getById(id);
}

export async function createCategory(data: {
  name: string;
  description?: string;
  image?: string;
}) {
  return categoriesService.create(data);
}

export async function updateCategory(
  id: string,
  data: {
    name?: string;
    description?: string;
    image?: string;
  }
) {
  return categoriesService.update(id, data);
}

export async function deleteCategory(id: string) {
  return categoriesService.delete(id);
}
