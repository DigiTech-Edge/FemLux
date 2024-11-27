"use server";

import { productsService } from "../products.service";
import type {
  ProductFilters,
  ProductFormData,
  ProductUpdateData,
} from "@/types/product";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

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

export async function addReview(data: {
  productId: string;
  rating: number;
  comment: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) throw new Error("Unauthorized");

  // First add the review and wait for it to complete
  const result = await productsService.addReview({ ...data, userId: user.id });

  // Then revalidate the path after the review is added
  revalidatePath(`/shop/${data.productId}`);

  return result;
}
