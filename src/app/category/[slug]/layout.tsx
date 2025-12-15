import { slugify } from '@/lib/utils';
import { categories } from '@/lib/data';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

const specialCategories: { [key: string]: string } = {
  superdeals: 'SuperDeals',
  'home-improvement-lighting': 'Home Improvement & Lighting',
  'tools-industrial': 'Tools & Industrial',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const categoryName = specialCategories[slug] || categories.find((c) => slugify(c.name) === slug)?.name;

  if (!categoryName) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${categoryName} | GlobalCart`,
    description: `Explore a wide range of products in the ${categoryName} category on GlobalCart. Find the best deals and top-quality items.`,
  };
}

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
