'use client';

import { notFound, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, ShieldCheck, Truck, Store } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from '@/components/skeletons/product-card-skeleton';

const RelatedProducts = dynamic(
  () => import('@/components/related-products').then((m) => m.RelatedProducts),
  { ssr: false }
);

function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
              <div className="space-y-3 pt-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-3">
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-9">
          <RelatedProductsSkeleton />
        </div>
      </div>
    </div>
  );
}

function RelatedProductsSkeleton() {
    return (
        <div className="bg-card p-6 rounded-lg shadow-sm">
            <Skeleton className="h-7 w-48 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
        </div>
    )
}

export function ProductDetailClient({ productId }: { productId: string }) {
  const { products: appProducts, addToCart, isProductsLoading } = useAppContext();
  const router = useRouter();

  const product = appProducts.find((p) => p.id === productId);

  if (isProductsLoading) {
    return <ProductPageSkeleton />;
  }

  if (!product) {
    notFound();
  }

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push('/cart');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="relative aspect-square">
            {product.imageUrl && (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-contain rounded-lg"
              />
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
              <span>{product.sold} sold</span>
            </div>

            <div className="my-6">
              <span className="text-3xl md:text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <div
              className="prose prose-sm max-w-none text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>

            <div className="mt-auto pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Button size="lg" onClick={() => addToCart(product, 1)}>
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        <div className="lg:col-span-3">
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Store className="w-5 h-5 text-primary" />
              {product.store.name}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                <span>On-time dispatch rate: 95%</span>
              </p>
              <p className="flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span>Free shipping on orders over $50</span>
              </p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-9">
          <RelatedProducts product={product} />
        </div>
      </div>
    </div>
  );
}
