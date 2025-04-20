import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import ArticleCard from "@/components/article/ArticleCard";
import { getClient, urlFor } from "@/lib/sanity/client";
import { FaTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa";

interface RelatedArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
  publishedAt: string;
  readTime: number;
  category: {
    title: string;
    slug: string;
  };
  author: {
    name: string;
  };
}

interface Params {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const article = await getArticleData(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: `${article.title} | TechPulse`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: urlFor(article.mainImage).width(1200).height(630).url(),
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

async function getArticleData(slug: string) {
  const client = getClient(false);

  const articleQuery = `
    *[_type == "article" && slug == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      body,
      mainImage,
      publishedAt,
      readTime,
      tags,
      category->{title, slug, _id},
      author->{name, image, bio, slug}
    }
  `;

  const article = await client.fetch(articleQuery, { slug });

  if (!article) {
    return null;
  }

  return article;
}

async function getRelatedArticles(slug: string, categoryId: string) {
  const client = getClient(false);

  const relatedArticlesQuery = `
    *[_type == "article" && slug != $slug && category._ref == $categoryId] | order(publishedAt desc)[0...3] {
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

  return client.fetch(relatedArticlesQuery, { slug, categoryId });
}

export async function generateStaticParams() {
  const client = getClient(false);
  const query = `*[_type == "article" && defined(slug)] { slug }`;
  const articles = await client.fetch(query);

  return articles.map((article: { slug: string }) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = params;
  const article = await getArticleData(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(slug, article.category._id);

  return (
    <article className="pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-12">
          <div className="mb-6">
            <Link
              href={`/categories/${article.category.slug}`}
              className="text-primary-600 font-medium"
            >
              {article.category.title}
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-gray-600 mb-8">{article.excerpt}</p>

          <div className="flex items-center mb-8">
            <div className="mr-4">
              <Image
                src={urlFor(article.author.image).width(56).height(56).url()}
                alt={article.author.name}
                width={56}
                height={56}
                className="rounded-full"
              />
            </div>
            <div>
              <div className="font-medium">{article.author.name}</div>
              <div className="text-gray-500 text-sm flex space-x-4">
                <span>
                  {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                </span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative h-[500px] max-w-5xl mx-auto mb-12 rounded-lg overflow-hidden">
          <Image
            src={urlFor(article.mainImage).width(1200).height(800).url()}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Article Content */}
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <PortableText value={article.body} />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12">
              <h3 className="font-medium text-gray-700 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-800 hover:bg-gray-200 transition duration-300"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-12 border-t border-b border-gray-200 py-6">
            <h3 className="font-medium text-gray-700 mb-3">
              Share this article:
            </h3>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  `https://techpulse.com/articles/${article.slug}`
                )}&text=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#1DA1F2] transition-colors"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `https://techpulse.com/articles/${article.slug}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#4267B2] transition-colors"
              >
                <FaFacebook className="h-6 w-6" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  `https://techpulse.com/articles/${article.slug}`
                )}&title=${encodeURIComponent(article.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-[#0077b5] transition-colors"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://techpulse.com/articles/${article.slug}`
                  );
                  alert("Link copied to clipboard!");
                }}
                className="text-gray-500 hover:text-primary-600 transition-colors"
              >
                <FaLink className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 bg-gray-50 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="mb-4 md:mb-0 md:mr-6">
                <Image
                  src={urlFor(article.author.image).width(80).height(80).url()}
                  alt={article.author.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {article.author.name}
                </h3>
                <p className="text-gray-600 mb-4">{article.author.bio}</p>
                <Link
                  href={`/authors/${article.author.slug}`}
                  className="text-primary-600 font-medium hover:text-primary-800"
                >
                  View all posts by {article.author.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-16 mt-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((article: RelatedArticle) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
