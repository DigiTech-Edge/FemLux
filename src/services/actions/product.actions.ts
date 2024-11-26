"use server";

import { productsService } from "../products.service";
import type { ProductFilters, ProductFormData, ProductUpdateData } from "@/types/product";

export async function getAllProducts() {
  return productsService.getAll();
}

export async function getFilteredProducts(filters?: ProductFilters) {
  return productsService.getFiltered(filters);
}

export async function getProductById(id: string) {
  return productsService.getById(id);
}

export async function createProduct(data: ProductFormData) {
  return productsService.create(data);
}

export async function updateProduct(id: string, data: ProductUpdateData) {
  return productsService.update(id, data);
}

export async function deleteProduct(id: string) {
  return productsService.delete(id);
}

export async function getNewArrivals(limit?: number) {
  return productsService.getNewArrivals(limit);
}
