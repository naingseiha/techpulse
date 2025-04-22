import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb/database";
import Article from "@/models/Article";
import { revalidatePath } from "next/cache";

// GET: Fetch all articles for admin
export async function GET(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") || "";

  try {
    await dbConnect();

    // Build query
    let query: any = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
        ],
      };
    }

    if (categoryId) {
      query.category = categoryId;
    }

    // Execute query
    const articles = await Article.find(query)
      .populate("author", "name image")
      .populate("category", "name slug")
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Article.countDocuments(query);

    return NextResponse.json({
      articles,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Error fetching articles" },
      { status: 500 }
    );
  }
}

// POST: Create a new article
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getServerSession();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    await dbConnect();

    // Create article
    const article = await Article.create({
      ...body,
      author: session.user.id, // Set the current user as author
    });

    // Revalidate paths
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/categories/${body.category}`);

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error("Error creating article:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).reduce(
        (errors: Record<string, string>, key) => {
          errors[key] = error.errors[key].message;
          return errors;
        },
        {}
      );

      return NextResponse.json(
        { error: "Validation error", validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error creating article" },
      { status: 500 }
    );
  }
}
