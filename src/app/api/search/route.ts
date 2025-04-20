import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/lib/sanity/client";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");

  if (!q) {
    return NextResponse.json(
      { message: "Search query is required" },
      { status: 400 }
    );
  }

  try {
    const client = getClient(false);

    const articlesQuery = `
      *[_type == "article" && (
        title match $query ||
        excerpt match $query ||
        pt::text(body) match $query
      )] | order(publishedAt desc) [0...12] {
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

    const articles = await client.fetch(articlesQuery, {
      query: `*${q}*`,
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("Error searching articles:", error);
    return NextResponse.json(
      { message: "Error searching articles", error },
      { status: 500 }
    );
  }
}
