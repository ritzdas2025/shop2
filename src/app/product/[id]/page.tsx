import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { products as allProductsData } from '@/lib/data';
import { ProductDetailClient } from './product-detail-client';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = allProductsData.find((p) => p.id === params.id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} | GlobalCart`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />;
}
