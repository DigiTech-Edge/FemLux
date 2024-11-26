"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
  Pagination,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import { Eye, Edit2, Trash2, Search, ImageIcon, Package2 } from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { ProductWithRelations } from "@/types/product";
import type { CategoryWithCount } from "@/types/category";
import Image from "next/image";

interface ProductsTableProps {
  products: ProductWithRelations[];
  categories: CategoryWithCount[];
  onView: (product: ProductWithRelations) => void;
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (product: ProductWithRelations) => void;
  onFilterChange: (filters: string) => void;
}

const rowsPerPageOptions = [5, 10, 15, 20, 25, 30];

export default function ProductsTable({
  products,
  categories,
  onView,
  onEdit,
  onDelete,
  onFilterChange,
}: ProductsTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Text search
    if (filterValue) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          product.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.categoryId === selectedCategory
      );
    }

    // Status filter
    switch (statusFilter) {
      case "inStock":
        filtered = filtered.filter((product) =>
          product.variants.some((v) => v.stock > 0)
        );
        break;
      case "outOfStock":
        filtered = filtered.filter((product) =>
          product.variants.every((v) => v.stock === 0)
        );
        break;
      case "new":
        filtered = filtered.filter((product) => product.isNew);
        break;
    }

    return filtered;
  }, [products, filterValue, selectedCategory, statusFilter]);

  // Update parent component about filter changes
  useEffect(() => {
    const filters = {
      search: filterValue,
      category: selectedCategory,
      status: statusFilter,
    };
    onFilterChange(JSON.stringify(filters));
  }, [filterValue, selectedCategory, statusFilter, onFilterChange]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredProducts.slice(start, end);
  }, [page, filteredProducts, rowsPerPage]);

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (product: ProductWithRelations) => (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{product.name}</span>
              {product.isNew && (
                <Chip size="sm" color="success" variant="flat">
                  New
                </Chip>
              )}
            </div>
            <span className="text-small text-default-500">
              {product.category.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (product: ProductWithRelations) => {
        const totalStock = product.variants.reduce(
          (sum, v) => sum + v.stock,
          0
        );
        const hasStock = product.variants.some((v) => v.stock > 0);
        return (
          <Chip
            className="capitalize"
            color={hasStock ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {totalStock} in stock
          </Chip>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      render: (product: ProductWithRelations) => {
        const lowestPrice = Math.min(...product.variants.map((v) => v.price));
        const highestPrice = Math.max(...product.variants.map((v) => v.price));
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {formatCurrency(lowestPrice)}
              {lowestPrice !== highestPrice &&
                ` - ${formatCurrency(highestPrice)}`}
            </p>
            <p className="text-bold text-tiny text-default-500">
              {product.variants.length} variants
            </p>
          </div>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (product: ProductWithRelations) => (
        <div className="relative flex items-center gap-2">
          <Tooltip content="View Details">
            <Button isIconOnly variant="light" onPress={() => onView(product)}>
              <Eye className="text-default-500" size={20} />
            </Button>
          </Tooltip>
          <Tooltip content="Edit Product">
            <Button isIconOnly variant="light" onPress={() => onEdit(product)}>
              <Edit2 className="text-default-500" size={20} />
            </Button>
          </Tooltip>
          <Tooltip color="danger" content="Delete Product">
            <Button
              isIconOnly
              variant="light"
              onPress={() => onDelete(product)}
            >
              <Trash2 className="text-danger" size={20} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center sm:flex-row gap-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name..."
          startContent={<Search className="text-default-300" size={20} />}
          value={filterValue}
          onClear={() => setFilterValue("")}
          onValueChange={setFilterValue}
        />
        <div className="flex flex-1 gap-4 items-center justify-end">
          <Select
            label="Category"
            placeholder="Select category"
            className="max-w-xs"
            selectedKeys={[selectedCategory]}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {[{ id: "all", name: "All Categories" }, ...categories].map(
              (category) => (
                <SelectItem key={category.id} textValue={category.name}>
                  {category.name}
                </SelectItem>
              )
            )}
          </Select>
          <Select
            label="Status"
            placeholder="Select status"
            className="max-w-xs"
            selectedKeys={[statusFilter]}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <SelectItem key="all" value="all">
              All Status
            </SelectItem>
            <SelectItem key="inStock" value="inStock">
              In Stock
            </SelectItem>
            <SelectItem key="outOfStock" value="outOfStock">
              Out of Stock
            </SelectItem>
            <SelectItem key="new" value="new">
              New Arrivals
            </SelectItem>
          </Select>
        </div>
      </div>

      <Table
        aria-label="Products table"
        bottomContent={
          <div className="flex w-full md:flex-row flex-col-reverse gap-4 justify-between items-center">
            <div className="flex flex-col items-center gap-2">
              <Select
                label="Rows per page"
                size="sm"
                className="w-32"
                selectedKeys={[rowsPerPage.toString()]}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                {rowsPerPageOptions.map((value) => (
                  <SelectItem key={value} textValue={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </Select>
            </div>
            {pages > 0 && (
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
              />
            )}
            <div className="max-md:hidden" />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-12">
              <Package2 className="w-12 h-12 text-default-300 mb-4" />
              <p className="text-default-300 text-lg">No products found</p>
              <p className="text-default-300 text-sm">
                Try adjusting your filters or add some products.
              </p>
            </div>
          }
        >
          {(item) => (
            <TableRow key={item.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>{column.render(item)}</TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
