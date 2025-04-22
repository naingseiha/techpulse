import Link from "next/link";
import { Metadata } from "next";
import { fetchFromSanity } from "@/lib/sanity/client";

export const metadata: Metadata = {
  title: "Categories | TechPulse",
  description:
    "Browse technology articles by category - AI, Web Development, Programming, Gadgets, Mobile, and more.",
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

async function getCategoriesData() {
  const categoriesQuery = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      "slug": slug.current,
      description,
      "articleCount": count(*[_type == "article" && references(^._id)])
    }
  `;

  return fetchFromSanity(categoriesQuery);
}

export default async function CategoriesPage() {
  const categories = await getCategoriesData();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center">Categories</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category: any) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="block bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
                {category.description && (
                  <p className="text-gray-600 mb-4">{category.description}</p>
                )}
                <p className="text-primary-600 font-medium">
                  {category.articleCount}{" "}
                  {category.articleCount === 1 ? "article" : "articles"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
