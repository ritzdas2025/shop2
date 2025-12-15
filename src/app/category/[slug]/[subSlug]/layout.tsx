import { slugify } from '@/lib/utils';
import { categories, subCategories } from '@/lib/data';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string, subSlug: string };
};

const specialCategories: { [key: string]: string } = {
  superdeals: 'SuperDeals',
  'home-improvement-lighting': 'Home Improvement & Lighting',
  'tools-industrial': 'Tools & Industrial',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, subSlug } = params;
  const categoryName = specialCategories[slug] || categories.find((c) => slugify(c.name) === slug)?.name;

  if (!categoryName) {
    return {
      title: 'Category Not Found',
    };
  }

  const currentSubCategories = subCategories[categoryName] || [];
  const subCategory = currentSubCategories.find(sc => slugify(sc.name) === subSlug);
  const subCategoryName = subCategory?.name;

  if (!subCategoryName) {
      return {
          title: 'Subcategory not found'
      }
  }


  return {
    title: `${subCategoryName} | ${categoryName} | GlobalCart`,
    description: `Explore ${subCategoryName} in the ${categoryName} category on GlobalCart.`,
  };
}

export default function SubCategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
