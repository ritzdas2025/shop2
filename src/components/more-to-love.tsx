'use client';

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { ProductCard } from './product-card';
import { Button } from './ui/button';
import type { Product } from '@/lib/types';

const INITIAL_LOAD_COUNT = 12;
const LOAD_MORE_COUNT = 12;

interface MoreToLoveProps {
  initialProducts?: Product[];
}

export function MoreToLove({ initialProducts }: MoreToLoveProps) {
  const { products: allProducts } = useAppContext();
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD_COUNT);
  
  const productsToDisplay = useMemo(() => {
    return (initialProducts || allProducts).filter(p => p.published);
  }, [initialProducts, allProducts]);

  const visibleProducts = productsToDisplay.slice(0, visibleCount);
  
  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + LOAD_MORE_COUNT);
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">More to love</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {visibleCount < productsToDisplay.length && (
          <div className="text-center mt-8">
            <Button variant="outline" onClick={handleLoadMore}>Load More</Button>
          </div>
        )}
    </section>
  );
}
