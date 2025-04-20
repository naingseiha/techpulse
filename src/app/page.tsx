import { Metadata } from "next";
import FeaturedArticle from "@/components/home/FeaturedArticle";
import ArticleCard from "@/components/article/ArticleCard";
import { fetchFromSanity } from "@/lib/sanity/client";

export const metadata: Metadata = {
  title: "TechPulse - Your Source for Technology News and Insights",
  description:
    "Stay updated with the latest technology news, reviews, and insights from TechPulse.",
};

export const revalidate = 60; // ISR: Revalidate every 60 seconds

async function getHomePageData() {
  // Fetch featured article
  const featuredArticleQuery = `
    *[_type == "article" && isFeatured == true] | order(publishedAt desc)[0] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      readTime,
      category->{title, slug},
      author->{name, image}
    }
  `;

  // Fetch latest articles (excluding the featured one)
  const latestArticlesQuery = `
    *[_type == "article" && isFeatured != true] | order(publishedAt desc)[0...6] {
      _id,
      title,
      slug,
      excerpt,
      mainImage,
      publishedAt,
      readTime,
      category->{title, slug},
      author->{name}
    }
  `;

  // Fetch categories
  const categoriesQuery = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug
    }
  `;

  const [featuredArticle, latestArticles, categories] = await Promise.all([
    fetchFromSanity(featuredArticleQuery),
    fetchFromSanity(latestArticlesQuery),
    fetchFromSanity(categoriesQuery),
  ]);

  return {
    featuredArticle,
    latestArticles,
    categories,
  };
}

export default async function Home() {
  const { featuredArticle, latestArticles, categories } =
    await getHomePageData();

  return (
    <>
      <section className="py-8">
        <div className="container mx-auto px-4">
          {featuredArticle && <FeaturedArticle article={featuredArticle} />}
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest Articles</h2>
            <div className="flex space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="whitespace-nowrap px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-primary-50 hover:border-primary-500 transition duration-300"
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/articles"
              className="inline-block px-6 py-3 rounded-md bg-primary-600 text-white font-medium hover:bg-primary-700 transition duration-300"
            >
              View All Articles
            </a>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Stay Updated with TechPulse
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Subscribe to our newsletter and never miss the latest technology
            news, reviews, and insights.
          </p>

          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-l-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-r-md font-medium hover:bg-primary-700 transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
