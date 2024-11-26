"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@nextui-org/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductFilters } from "@/lib/types/products";
import ActiveFilters from "@/components/interfaces/shop/ActiveFilters";
import FilterDrawer from "@/components/interfaces/shop/FilterDrawer";
import ProductCard from "@/components/ui/ProductCard";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductWithRelations } from "@/types/product";
import { CategoryWithCount } from "@/types/category";

interface ShopClientProps {
  products: ProductWithRelations[];
  categories: CategoryWithCount[];
  initialFilters: Partial<ProductFilters>;
}

export default function ShopClient({
  products,
  categories,
  initialFilters,
}: ShopClientProps) {
  const router = useRouter();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(
    initialFilters.search || ""
  );
  const [currentFilters, setCurrentFilters] = React.useState<ProductFilters>(
    initialFilters as ProductFilters
  );
  const debouncedSearch = useDebounce(searchTerm, 500);

  // Calculate filtered products
  const filteredProducts = React.useMemo(() => {
    return products.filter((product) => {
      // Search filter
      if (currentFilters.search) {
        const searchLower = currentFilters.search.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (currentFilters.categories?.length) {
        if (!currentFilters.categories.includes(product.category.name)) {
          return false;
        }
      }

      // Price range filter
      if (currentFilters.priceRange) {
        const { min, max } = currentFilters.priceRange;
        const productPrice = Math.min(...product.variants.map((v) => v.price));
        if (productPrice < min || productPrice > max) {
          return false;
        }
      }

      return true;
    });
  }, [products, currentFilters]);

  // Calculate price range
  const priceRange = React.useMemo(() => {
    const prices = products.flatMap((p) => p.variants.map((v) => v.price));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [products]);

  useEffect(() => {
    const newFilters = { ...currentFilters, search: debouncedSearch };
    setCurrentFilters(newFilters);
    updateURL(newFilters);
  }, [debouncedSearch]);

  const updateURL = (filters: ProductFilters) => {
    const params = new URLSearchParams();

    if (filters.search) {
      params.set("search", filters.search);
    }

    if (filters.categories?.length) {
      filters.categories.forEach((cat) => params.append("categories", cat));
    }

    if (filters.priceRange) {
      params.set("minPrice", filters.priceRange.min.toString());
      params.set("maxPrice", filters.priceRange.max.toString());
    }

    router.push(`/shop?${params.toString()}`);
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setCurrentFilters(newFilters);
    updateURL(newFilters);
  };

  const handleRemoveFilter = (key: keyof ProductFilters, value?: string) => {
    const newFilters = { ...currentFilters };

    if (value && Array.isArray(newFilters[key])) {
      const arrayKey = key as keyof Pick<ProductFilters, "categories">;
      newFilters[arrayKey] = (newFilters[arrayKey] as string[])?.filter(
        (v) => v !== value
      );
      if ((newFilters[arrayKey] as string[])?.length === 0) {
        delete newFilters[arrayKey];
      }
    } else {
      delete newFilters[key];
    }

    setCurrentFilters(newFilters);
    updateURL(newFilters);
  };

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background border-b rounded mt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 py-4">
            <div className="flex-1">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="max-w-sm"
                isClearable
                onClear={() => setSearchTerm("")}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="bordered"
                startContent={<SlidersHorizontal className="w-4 h-4" />}
                onPress={() => setIsFilterDrawerOpen(true)}
              >
                <p className="max-sm:hidden">Filters</p>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      <ActiveFilters filters={currentFilters} onRemove={handleRemoveFilter} />

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Try adjusting your search or filters to find what you&apos;re
            looking for.
          </p>
          <Button
            color="primary"
            variant="flat"
            onPress={() => {
              setSearchTerm("");
              handleFilterChange({} as ProductFilters);
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        categories={categories}
        priceRange={priceRange}
      />
    </main>
  );
}
