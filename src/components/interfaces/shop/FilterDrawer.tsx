"use client";

import React, { useEffect } from "react";
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
} from "@nextui-org/react";
import { X } from "lucide-react";
import { ProductFilters } from "@/types/product";
import { CategoryWithCount } from "@/types/category";
import Drawer from "@/components/ui/Drawer";

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: Partial<ProductFilters>;
  onFilterChange: (filters: ProductFilters, clearAll?: boolean) => void;
  categories: CategoryWithCount[];
  priceRange: { min: number; max: number };
}

export default function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categories,
  priceRange,
}: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = React.useState<ProductFilters>(
    filters as ProductFilters
  );

  const handleFilterChange = (
    key: keyof ProductFilters,
    value: ProductFilters[keyof ProductFilters]
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  const handleClearFilters = () => {
    const emptyFilters: ProductFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters, true);
    onClose();
  };

  useEffect(() => {
    setLocalFilters(filters as ProductFilters);
  }, [filters]);

  const header = (
    <div className="flex items-center justify-between p-4">
      <h2 className="text-lg font-semibold">Filters</h2>
      <Button isIconOnly variant="light" onPress={onClose}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );

  const footer = (
    <div className="flex items-center justify-between">
      <Button
        variant="light"
        color="danger"
        onPress={handleClearFilters}
        startContent={<X className="w-4 h-4" />}
      >
        Clear Filters
      </Button>
      <Button color="primary" onPress={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      placement="left"
      size="sm"
      header={header}
      footer={footer}
    >
      <div className="flex-1 overflow-y-auto">
        <Accordion>
          {/* Categories */}
          <AccordionItem key="categories" title="Categories">
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <Checkbox
                  key={category.id}
                  value={category.name}
                  isSelected={localFilters.categories?.includes(category.name)}
                  onValueChange={(isSelected) => {
                    const currentCategories = localFilters.categories || [];
                    handleFilterChange(
                      "categories",
                      isSelected
                        ? [...currentCategories, category.name]
                        : currentCategories.filter((c) => c !== category.name)
                    );
                  }}
                >
                  {category.name}
                  <span className="text-sm text-gray-500 ml-1">
                    ({category._count.products})
                  </span>
                </Checkbox>
              ))}
            </div>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem key="price" title="Price Range">
            <div className="px-2">
              <Slider
                label="Price Range"
                step={10}
                minValue={priceRange.min}
                maxValue={priceRange.max}
                value={[
                  localFilters.priceRange?.min || priceRange.min,
                  localFilters.priceRange?.max || priceRange.max,
                ]}
                formatOptions={{ style: "currency", currency: "GHS" }}
                onChange={(value) => {
                  if (Array.isArray(value)) {
                    handleFilterChange("priceRange", {
                      min: value[0],
                      max: value[1],
                    });
                  }
                }}
                className="max-w-md"
              />
            </div>
          </AccordionItem>

          {/* Status */}
          <AccordionItem
            key="status"
            aria-label="Status"
            title="Status"
            classNames={{
              content: "px-2",
            }}
          >
            <RadioGroup
              value={
                localFilters.isNew === undefined
                  ? "all"
                  : localFilters.isNew?.toString()
              }
              onValueChange={(value) =>
                handleFilterChange(
                  "isNew",
                  value === "all" ? undefined : value === "true"
                )
              }
            >
              <Radio value="all">All Products</Radio>
              <Radio value="true">New Arrivals</Radio>
            </RadioGroup>
          </AccordionItem>
        </Accordion>
      </div>
    </Drawer>
  );
}
