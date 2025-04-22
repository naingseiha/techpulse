import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/article/ArticleCard";
import { fetchFromSanity } from "@/lib/sanity/client";
import LoadMoreButton from "@/components/common/LoadMoreButton";

interface Params {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const category = await getCategoryData(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.title} | TechPulse`,
    description:
      category.description ||
      `Browse the latest articles about ${category.title} on TechPulse.`,
  };
}

async function getCategoryData(slug: string) {
  const categoryQuery = `
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      description
    }
  `;

  return fetchFromSanity(categoryQuery, { slug });
}

async function getCategoryArticles(slug: string) {
  const ARTICLES_PER_PAGE = 9;

  const articlesQuery = `
    *[_type == "article" && category._ref in *[_type=="category" && slug.current==$slug]._id] | order(publishedAt desc) [0...${ARTICLES_PER_PAGE}] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      readTime,
      category->{title, "slug": slug.current},
      author->{name}
    }
  `;

  const totalCountQuery = `
    count(*[_type == "article" && category._ref in *[_type=="category" && slug.current==$slug]._id])
  `;

  const [articles, totalArticles] = await Promise.all([
    fetchFromSanity(articlesQuery, { slug }),
    fetchFromSanity(totalCountQuery, { slug }),
  ]);

  return { articles, totalArticles };
}

export async function generateStaticParams() {
  const categoriesQuery = `*[_type == "category" && defined(slug.current)] { "slug": slug.current }`;
  const categories = await fetchFromSanity(categoriesQuery);

  return categories.map((category: { slug: string }) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = params;
  const category = await getCategoryData(slug);

  if (!category) {
    notFound();
  }

  const { articles, totalArticles } = await getCategoryArticles(slug);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{category.title}</h1>
          {category.description && (
            <p className="text-xl text-gray-600">{category.description}</p>
          )}
        </div>

        {articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article: any) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>

            <LoadMoreButton
              initialPage={1}
              initialItems={articles}
              totalItems={totalArticles}
              itemsPerPage={9}
              apiEndpoint={`/api/articles?category=${slug}`}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No articles found in this category.
            </p>
            <Link
              href="/categories"
              className="inline-block mt-4 px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition duration-300"
            >
              Browse All Categories
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
