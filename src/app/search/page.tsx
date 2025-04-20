"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ArticleCard from "@/components/article/ArticleCard";
import { FaSearch } from "react-icons/fa";

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    image?: string;
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>(q || "");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      searchArticles(q);
    }
  }, [q]);

  const searchArticles = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      setArticles(data.articles || []);
      setSearched(true);
    } catch (error) {
      console.error("Error searching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      searchArticles(searchQuery);
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Search Articles
          </h1>

          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for articles, topics, or keywords..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />

            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white px-4 py-1 rounded-md hover:bg-primary-700 transition duration-300"
            >
              Search
            </button>
          </form>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        ) : searched ? (
          <>
            {articles.length > 0 ? (
              <>
                <p className="text-center text-gray-600 mb-12">
                  Found {articles.length}{" "}
                  {articles.length === 1 ? "result" : "results"} for &quot;{q}
                  &quot;
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article: Article) => (
                    <ArticleCard key={article._id} article={article} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-2xl font-medium mb-4">
                  No results found for &quot;{q}&quot;
                </p>
                <p className="text-gray-600 mb-8">
                  Try different keywords or browse our categories instead.
                </p>
                <a
                  href="/categories"
                  className="inline-block px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition duration-300"
                >
                  Browse Categories
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p>Enter a search term to find articles</p>
          </div>
        )}
      </div>
    </section>
  );
}
