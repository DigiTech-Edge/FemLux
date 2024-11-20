import { products } from '@/lib/data/products'
import ProductDetails from '@/components/interfaces/shop/ProductDetails'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find(p => p.id === parseInt(params.id))

  if (!product) {
    notFound()
  }

  const productDetails = {
    ...product,
    images: product.images.map((url, index) => ({
      id: index + 1,
      url,
      alt: `${product.name} - View ${index + 1}`,
      isPrimary: index === 0
    })),
    features: [
      'High-quality materials',
      'Comfortable fit',
      'Durable construction',
      'Stylish design'
    ],
    specifications: {
      'Material': 'Premium fabric blend',
      'Care Instructions': 'Machine washable',
      'Country of Origin': 'Made in USA',
      'Style': 'Contemporary'
    },
    relatedProducts: products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
      .map(p => p.id)
  }

  return <ProductDetails product={productDetails} />
}
