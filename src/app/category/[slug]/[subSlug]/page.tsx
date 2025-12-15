'use client';

import { notFound } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useAppContext } from '@/context/AppContext';
import { MoreToLove } from '@/components/more-to-love';
import { slugify } from '@/lib/utils';
import { categories, subCategories } from '@/lib/data';
import { useMemo } from 'react';

const specialCategories: { [key: string]: string } = {
  superdeals: 'SuperDeals',
  'home-improvement-lighting': 'Home Improvement & Lighting',
  'tools-industrial': 'Tools & Industrial',
};

function SubCategoryPageClient({
  slug,
  subSlug,
}: {
  slug: string;
  subSlug: string;
}) {
  const { products, isProductsLoading } = useAppContext();

  const categoryName = useMemo(() => specialCategories[slug] || categories.find((c) => slugify(c.name) === slug)?.name, [slug]);

  const subCategoryName = useMemo(() => {
    if (!categoryName) return null;
    const currentSubCategories = subCategories[categoryName] || [];
    return currentSubCategories.find((sc) => slugify(sc.name) === subSlug)?.name;
  }, [categoryName, subSlug]);

  const subCategoryProducts = useMemo(() => {
    if (!subCategoryName) return [];
    return products.filter(
      (p) =>
        p.published &&
        p.category === categoryName &&
        p.subcategory === subCategoryName
    );
  }, [products, categoryName, subCategoryName]);

  if (!isProductsLoading && (!categoryName || !subCategoryName)) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-muted/20">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/category/${slug}`}>{categoryName}</BreadcrumbLink>
          </BreadcrumbItem>
           <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subCategoryName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-xl font-bold mb-4">{subCategoryName}</h1>
      
      {isProductsLoading ? (
        <div>Loading products...</div>
      ) : subCategoryProducts.length > 0 ? (
        <MoreToLove initialProducts={subCategoryProducts} />
      ) : (
        <p>No products found in this subcategory.</p>
      )}

    </div>
  );
}


export default function SubCategoryPage({
  params,
}: {
  params: { slug: string; subSlug: string };
}) {
  const { slug, subSlug } = params;
  return <SubCategoryPageClient slug={slug} subSlug={subSlug} />;
}
