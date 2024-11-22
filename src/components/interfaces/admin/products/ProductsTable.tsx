"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Button,
  Pagination,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import {
  Eye,
  Edit2,
  Trash2,
  Star,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { formatCurrency } from "@/helpers";
import type { Product } from "@/lib/types/products";

interface ProductsTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

type StockStatus = {
  color: "danger" | "warning" | "success";
  text: string;
};

const rowsPerPageOptions = [5, 10, 15, 20, 25, 30];

const mockReviews = [
  {
    id: 1,
    user: "Sarah Johnson",
    rating: 5,
    comment:
      "Absolutely love this product! The quality is outstanding and it fits perfectly.",
    date: "2024-01-15",
  },
  {
    id: 2,
    user: "Mike Smith",
    rating: 4,
    comment:
      "Great product overall, but shipping took a bit longer than expected.",
    date: "2024-01-10",
  },
  {
    id: 3,
    user: "Emily Davis",
    rating: 5,
    comment: "Perfect fit and amazing quality! Will definitely buy more.",
    date: "2024-01-05",
  },
];

export default function ProductsTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState(
    new Set(["10"])
  );
  const [page, setPage] = useState(1);

  // Get unique categories
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (filterValue) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(filterValue.toLowerCase()) ||
          product.description.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((product) => {
        if (statusFilter === "inStock") return product.stock > 0;
        if (statusFilter === "lowStock")
          return product.stock <= 5 && product.stock > 0;
        if (statusFilter === "outOfStock") return product.stock === 0;
        return true;
      });
    }

    return filtered;
  }, [products, filterValue, selectedCategory, statusFilter]);

  const pages = Math.ceil(filteredProducts.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredProducts.slice(start, end);
  }, [page, filteredProducts, rowsPerPage]);

  const columns = [
    { name: "PRODUCT", uid: "product" },
    { name: "CATEGORY", uid: "category" },
    { name: "PRICE", uid: "price" },
    { name: "STOCK", uid: "stock" },
    { name: "RATING", uid: "rating" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const getStockStatus = (stock: number): StockStatus => {
    if (stock === 0) return { color: "danger", text: "Out of Stock" };
    if (stock <= 10) return { color: "warning", text: "Low Stock" };
    return { color: "success", text: "In Stock" };
  };

  const renderCell = (product: Product, columnKey: React.Key) => {
    switch (columnKey) {
      case "product":
        return (
          <User
            name={
              <div className="flex items-center gap-2">
                <span>{product.name}</span>
                {product.isNew && (
                  <Chip color="success" size="sm" variant="flat">
                    New
                  </Chip>
                )}
                {product.isBestSeller && (
                  <Chip color="warning" size="sm" variant="flat">
                    Best Seller
                  </Chip>
                )}
              </div>
            }
            avatarProps={{
              src: product.images[0],
              radius: "lg",
            }}
          />
        );
      case "category":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {product.category}
            </p>
            <div className="flex flex-wrap gap-1">
              {product.tags.map((tag) => (
                <Chip key={tag} size="sm" variant="flat">
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {formatCurrency(product.price)}
            </p>
          </div>
        );
      case "stock":
        const stockStatus = getStockStatus(product.stock);
        return (
          <Chip
            className="capitalize"
            color={stockStatus.color}
            size="sm"
            variant="flat"
          >
            {stockStatus.text} ({product.stock})
          </Chip>
        );
      case "rating":
        return (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span>{(product.rating || 0).toFixed(1)}</span>
            <span>({mockReviews.length.toLocaleString()})</span>
          </div>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="View details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onView(product)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Edit product">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onEdit(product)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete product">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => onDelete(product)}
              >
                <Trash2 className="w-4 h-4 text-danger" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 bg-default-100 rounded-lg">
          <div className="flex flex-1 gap-4 items-center w-full sm:w-auto">
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder="Search products..."
              startContent={<Search className="w-4 h-4 text-default-400" />}
              value={filterValue}
              onClear={() => setFilterValue("")}
              onValueChange={setFilterValue}
            />
            <Select
              className="w-full sm:max-w-[28%]"
              placeholder="Category"
              selectedKeys={[selectedCategory]}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </Select>
            <Select
              className="w-full sm:max-w-[28%]"
              placeholder="Status"
              selectedKeys={[statusFilter]}
              onChange={(e) => setStatusFilter(e.target.value)}
              startContent={
                <SlidersHorizontal className="w-4 h-4 text-default-400" />
              }
            >
              <SelectItem key="all" value="all">
                All Status
              </SelectItem>
              <SelectItem key="inStock" value="inStock">
                In Stock
              </SelectItem>
              <SelectItem key="lowStock" value="lowStock">
                Low Stock
              </SelectItem>
              <SelectItem key="outOfStock" value="outOfStock">
                Out of Stock
              </SelectItem>
            </Select>
          </div>
        </div>

        {/* Table */}
        <Table
          aria-label="Products table"
          bottomContent={
            pages > 1 ? (
              <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-small text-default-400 whitespace-nowrap">
                    Rows per page:
                  </span>
                  <Select
                    size="sm"
                    selectedKeys={selectedRowsPerPage}
                    onSelectionChange={(keys) => {
                      setSelectedRowsPerPage(keys as Set<string>);
                      const selectedValue = Array.from(keys)[0];
                      setRowsPerPage(Number(selectedValue));
                    }}
                    className="w-20"
                    aria-label="Rows per page"
                    disallowEmptySelection
                    selectionMode="single"
                    defaultSelectedKeys={["10"]}
                  >
                    {rowsPerPageOptions.map((value) => (
                      <SelectItem
                        key={value.toString()}
                        value={value.toString()}
                        className="text-small"
                      >
                        {value}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
                <div className="flex justify-center sm:justify-end">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                  />
                </div>
                <div className="hidden sm:block" />
              </div>
            ) : null
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={items}
            emptyContent={
              <div className="flex flex-col items-center justify-center h-48 text-default-400">
                <div className="text-3xl mb-2">🛍️</div>
                <div className="text-lg font-semibold">No products found</div>
                <div className="text-sm">
                  Try adjusting your search or filters
                </div>
              </div>
            }
          >
            {(product) => (
              <TableRow key={product.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(product, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
