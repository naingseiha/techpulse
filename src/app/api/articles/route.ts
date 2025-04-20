import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/sanity/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const author = searchParams.get("author");
  const search = searchParams.get("search");
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "9";

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  try {
    let query = `*[_type == "article"`;
    let params = {};

    // Filter by category
    if (category) {
      query += ` && category._ref in *[_type=="category" && slug.current==$category]._id`;
      params = { ...params, category };
    }

    // Filter by tag
    if (tag) {
      query += ` && $tag in tags`;
      params = { ...params, tag };
    }

    // Filter by author
    if (author) {
      query += ` && author._ref in *[_type=="author" && slug.current==$author]._id`;
      params = { ...params, author };
    }

    // Search in title or excerpt
    if (search) {
      query += ` && (title match $search || excerpt match $search)`;
      params = { ...params, search: `*${search}*` };
    }

    query += `] | order(publishedAt desc) [${offset}...${offset + limitNumber}] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      publishedAt,
      readTime,
      category->{title, "slug": slug.current},
      author->{name}
    }`;

    const client = getClient(false);
    const articles = await client.fetch(query, params);

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { message: "Error fetching articles", error },
      { status: 500 }
    );
  }
}
