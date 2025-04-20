import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { urlFor } from "@/lib/sanity/client";

interface FeaturedArticleProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    mainImage: any;
    publishedAt: string;
    author: {
      name: string;
      image: any;
    };
    category: {
      title: string;
      slug: string;
    };
    readTime: number;
  };
}

// Create a simple placeholder image component for local use
const ImagePlaceholder = ({ text }: { text: string }) => (
  <div className="flex items-center justify-center bg-gray-200 w-full h-full">
    <span className="text-gray-500">{text}</span>
  </div>
);

const FeaturedArticle = ({ article }: FeaturedArticleProps) => {
  // Check if we can generate a valid image URL
  const hasValidMainImage =
    article.mainImage && typeof article.mainImage !== "string";
  const hasValidAuthorImage =
    article.author.image && typeof article.author.image !== "string";

  // If we have a valid image, generate its URL
  const mainImageUrl = hasValidMainImage
    ? urlFor(article.mainImage).url()
    : null;
  const authorImageUrl = hasValidAuthorImage
    ? urlFor(article.author.image).width(40).height(40).url()
    : null;

  return (
    <div className="relative h-[500px] rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        {mainImageUrl ? (
          <Image
            src={mainImageUrl}
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
            <span className="text-white text-2xl">{article.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        <div className="mb-4">
          <Link
            href={`/categories/${article.category.slug}`}
            className="inline-block bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            {article.category.title}
          </Link>
        </div>

        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>

        <p className="text-white/90 mb-6 max-w-3xl text-lg">
          {article.excerpt}
        </p>

        <div className="flex items-center text-white/80">
          <div className="flex items-center mr-6">
            <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-600 flex items-center justify-center">
              {authorImageUrl ? (
                <Image
                  src={authorImageUrl}
                  alt={article.author.name}
                  width={40}
                  height={40}
                />
              ) : (
                <span className="text-white text-sm font-bold">
                  {article.author.name.charAt(0)}
                </span>
              )}
            </div>
            <span>{article.author.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>{format(new Date(article.publishedAt), "MMM d, yyyy")}</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle;
