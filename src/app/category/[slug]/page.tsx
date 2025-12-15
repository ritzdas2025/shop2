'use client';

import { categories, subCategories } from '@/lib/data';
import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
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
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { SuperdealsPageSkeleton } from '@/components/skeletons/superdeals-page-skeleton';
import { HomePageSkeleton } from '@/components/skeletons/home-page-skeleton';

const specialCategories: { [key: string]: string } = {
  superdeals: 'SuperDeals',
  'home-improvement-lighting': 'Home Improvement & Lighting',
  'tools-industrial': 'Tools & Industrial',
};

function SuperDealsPageComponent() {
  const { products, isProductsLoading } = useAppContext();
  const superdealsProducts = products.filter((p) => p.originalPrice);

  if (isProductsLoading) {
    return <SuperdealsPageSkeleton />;
  }

  const coupons = [
    { off: '184.93', over: '924.64', code: 'BF1002' },
    { off: '6,472.46', over: '46,139.39', code: 'BF4997' },
    { off: '4,623.18', over: '30,420.56', code: 'BF3295' },
    { off: '200.00', over: '1000.00', code: 'BF2024' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-3xl font-bold">SuperDeals</h1>
        <Zap className="w-6 h-6 text-yellow-500 fill-yellow-400" />
        <span className="text-sm text-muted-foreground">Cyber Monday - Up to 80% off</span>
      </div>

      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full mb-8"
      >
        <CarouselContent>
          {coupons.map((coupon, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div className="bg-white rounded-lg p-4 flex items-center justify-between border-2 border-primary/50 coupon-card">
                  <div>
                    <p className="text-2xl font-bold text-primary">Rs.{coupon.off} OFF</p>
                    <p className="text-xs text-muted-foreground">
                      orders Rs.{coupon.over}+ Code: {coupon.code}
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">Copy</Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
      </Carousel>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-6">
        {superdealsProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
       <div className="text-center text-muted-foreground mt-8 text-sm">
        - Results loaded -
      </div>
    </div>
  );
}


function DefaultCategoryPage({ categoryName, slug }: { categoryName: string, slug: string }) {
    const { products } = useAppContext();
    
    const currentSubCategories = subCategories[categoryName] || [];

    const categoryProducts = products.filter((p) => {
        if (!p.published) return false;
        return p.category === categoryName;
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-muted/20">
            <Breadcrumb className="mb-4">
                <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{categoryName}</BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-xl font-bold mb-4">{categoryName}</h1>
            
            {currentSubCategories.length > 0 && (
                <div className="bg-background p-4 rounded-lg mb-6">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-x-2 gap-y-4">
                    {currentSubCategories.map((sub) => (
                    <Link href={`/category/${slug}/${slugify(sub.name)}`} key={sub.name} className="flex flex-col items-center text-center group">
                        <div className="w-16 h-16 relative mb-1">
                        <Image src={sub.imageUrl} alt={sub.name} fill className="object-cover rounded-full" />
                        </div>
                        <span className="text-xs text-muted-foreground group-hover:text-primary">{sub.name}</span>
                    </Link>
                    ))}
                </div>
                </div>
            )}

            <MoreToLove initialProducts={categoryProducts} />
        </div>
    );
}


function CategoryPageClient({ slug }: { slug: string }) {
  const { isProductsLoading } = useAppContext();
  const categoryName = specialCategories[slug] || categories.find((c) => slugify(c.name) === slug)?.name;

  if (isProductsLoading) {
    if (slug === 'superdeals') {
        return <SuperdealsPageSkeleton />;
    }
    return <HomePageSkeleton />;
  }

  if (!categoryName) {
    notFound();
  }

  if (slug === 'superdeals') {
    return <SuperDealsPageComponent />;
  }

  return <DefaultCategoryPage categoryName={categoryName} slug={slug} />;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return <CategoryPageClient slug={params.slug} />;
}
