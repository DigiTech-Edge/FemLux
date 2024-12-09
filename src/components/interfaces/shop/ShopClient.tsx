"use client";

import React, { useTransition } from "react";
import { Button, Input } from "@nextui-org/react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductFilters } from "@/lib/types/products";
import ActiveFilters from "@/components/interfaces/shop/ActiveFilters";
import FilterDrawer from "@/components/interfaces/shop/FilterDrawer";
import ProductCard from "@/components/ui/ProductCard";
import { ProductWithRelations } from "@/types/product";
import { CategoryWithCount } from "@/types/category";
import { updateSearchParams } from "@/helpers/searchParams";

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
  const [isPending] = useTransition();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(
    initialFilters.search || ""
  );
  const [currentFilters, setCurrentFilters] = React.useState<ProductFilters>(
    initialFilters as ProductFilters
  );

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

      // New products filter
      if (currentFilters.isNew !== undefined) {
        if (product.isNew !== currentFilters.isNew) {
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

  const updateURL = (filters: ProductFilters, clearAll?: boolean) => {
    updateSearchParams({
      url: "/shop",
      params: {
        search: { value: filters.search },
        categories: { value: filters.categories, joinWith: "," },
        minPrice: { value: filters.priceRange?.min },
        maxPrice: { value: filters.priceRange?.max },
        isNew: {
          value:
            filters.isNew === undefined ? undefined : filters.isNew.toString(),
        },
      },
      clearAll,
    });
  };

  console.log(isFilterDrawerOpen);

  const handleSearch = (value: string) => {
    const newFilters = { ...currentFilters, search: value };
    setSearchTerm(value);
    setCurrentFilters(newFilters);
    updateURL(newFilters);
  };

  const handleFilterChange = (filters: ProductFilters, clearAll?: boolean) => {
    setCurrentFilters(filters);
    if (filters.search !== undefined) {
      setSearchTerm(filters.search);
    }
    updateURL(filters, clearAll);
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
      if (key === "search") {
        setSearchTerm("");
      }
    }

    setCurrentFilters(newFilters);
    updateURL(newFilters);
  };

  const handleClearAll = () => {
    setCurrentFilters({});
    setSearchTerm("");
    updateURL({}, true);
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
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search products..."
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                className="max-w-sm"
                isClearable
                onClear={() => handleSearch("")}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="bordered"
                startContent={<SlidersHorizontal className="w-4 h-4" />}
                onPress={() => setIsFilterDrawerOpen(true)}
                isDisabled={isPending}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            onPress={handleClearAll}
            isDisabled={isPending}
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
