import { getProductById } from "@/services/actions/product.actions";
import ProductDetails from "@/components/interfaces/shop/ProductDetails";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  return <ProductDetails product={product} />;
}
