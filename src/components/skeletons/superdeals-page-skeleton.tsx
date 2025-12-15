import { Skeleton } from '@/components/ui/skeleton';
import { ProductCardSkeleton } from './product-card-skeleton';

export function SuperdealsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Coupon Carousel Skeleton */}
      <div className="flex space-x-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-1 w-1/3">
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
        ))}
      </div>

      {/* Product Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6">
        {[...Array(18)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
       <div className="text-center mt-8">
        <Skeleton className="h-5 w-32 mx-auto" />
      </div>
    </div>
  );
}
