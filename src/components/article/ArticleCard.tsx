import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { urlFor } from "@/lib/sanity/client";

interface ArticleCardProps {
  article: {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    mainImage: any;
    publishedAt: string;
    author: {
      name: string;
    };
    category: {
      title: string;
      slug: string;
    };
    readTime: number;
  };
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  // Generate image URL with fallback
  const getImageUrl = (image: any) => {
    if (!image) return "https://via.placeholder.com/600x400?text=Article";
    if (typeof image === "string") return image;
    try {
      return urlFor(image).width(600).height(400).url();
    } catch (error) {
      console.error("Error generating image URL:", error);
      return "https://via.placeholder.com/600x400?text=Article";
    }
  };

  const mainImageUrl = getImageUrl(article.mainImage);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 md:h-64">
        <Image
          src={mainImageUrl}
          alt={article.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>

      <div className="p-6">
        <div className="mb-3">
          <Link
            href={`/categories/${article.category.slug}`}
            className="text-primary-600 font-medium text-sm"
          >
            {article.category.title}
          </Link>
        </div>

        <h3 className="text-xl font-bold mb-2">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

        <div className="flex items-center text-gray-500 text-sm">
          <span className="mr-4">By {article.author.name}</span>
          <span className="mr-4">
            {format(new Date(article.publishedAt), "MMM d, yyyy")}
          </span>
          <span>{article.readTime} min read</span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
