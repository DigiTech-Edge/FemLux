-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "product_variants" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
