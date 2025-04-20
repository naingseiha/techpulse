import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// Check if we're in a development environment
const isDev = process.env.NODE_ENV === "development";

// Use a fallback projectId for development if not provided
const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || (isDev ? "development" : "");
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Validate projectId to ensure it only contains a-z, 0-9, and dashes
const isValidProjectId = (id: string) => /^[a-z0-9-]+$/.test(id) || id === "";

// For development, we can use a mock client if there's no valid project ID
export const config = {
  projectId: isValidProjectId(projectId) ? projectId : "placeholder-project-id",
  dataset,
  apiVersion: "2023-05-03",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

// A more robust urlFor function that handles various scenarios
export const urlFor = (source: any) => {
  if (!source) {
    return {
      url: () => "https://via.placeholder.com/800x600?text=No+Image",
      width: () => ({
        height: () => ({
          url: () => "https://via.placeholder.com/800x600?text=No+Image",
        }),
      }),
    };
  }

  // If source is a string (like "placeholder" or a URL)
  if (typeof source === "string") {
    return {
      url: () =>
        source.startsWith("http")
          ? source
          : "https://via.placeholder.com/800x600?text=" + source,
      width: () => ({
        height: () => ({
          url: () =>
            source.startsWith("http")
              ? source
              : "https://via.placeholder.com/800x600?text=" + source,
        }),
      }),
    };
  }

  try {
    return imageUrlBuilder(sanityClient).image(source);
  } catch (error) {
    console.error("Error building image URL:", error);
    return {
      url: () => "https://via.placeholder.com/800x600?text=Error",
      width: () => ({
        height: () => ({
          url: () => "https://via.placeholder.com/800x600?text=Error",
        }),
      }),
    };
  }
};

export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const getClient = (preview: boolean) =>
  preview ? previewClient : sanityClient;

// For development, we should provide mock data if Sanity is not configured
export const fetchFromSanity = async (query: string, params = {}) => {
  try {
    if (!isValidProjectId(projectId) || projectId === "") {
      console.warn("Using mock data: No valid Sanity projectId available");
      return getMockData(query);
    }

    return await sanityClient.fetch(query, params);
  } catch (error) {
    console.error("Error fetching from Sanity:", error);
    return getMockData(query);
  }
};

// Helper to provide mock data for development
function getMockData(query: string) {
  // If query contains "featured" - return featured article mock
  if (query.includes("isFeatured == true")) {
    return {
      _id: "mock-featured-1",
      title: "The Future of AI in Web Development",
      slug: "future-of-ai-in-web-development",
      excerpt:
        "Exploring how artificial intelligence is changing the way we build websites and web applications.",
      mainImage: "https://via.placeholder.com/1200x600?text=AI+in+Web+Dev",
      publishedAt: new Date().toISOString(),
      readTime: 8,
      category: { title: "AI", slug: "ai" },
      author: {
        name: "John Doe",
        image: "https://via.placeholder.com/80x80?text=JD",
      },
    };
  }

  // If query is for latest articles
  if (query.includes("isFeatured != true")) {
    return Array(6)
      .fill(null)
      .map((_, i) => ({
        _id: `mock-article-${i}`,
        title: `Sample Article ${i + 1}`,
        slug: `sample-article-${i + 1}`,
        excerpt: "This is a mock article for development purposes.",
        mainImage: `https://via.placeholder.com/600x400?text=Article+${i + 1}`,
        publishedAt: new Date().toISOString(),
        readTime: 5,
        category: { title: "Technology", slug: "technology" },
        author: { name: "Jane Smith" },
      }));
  }

  // If query is for categories
  if (query.includes('_type == "category"')) {
    return [
      { _id: "cat-1", title: "Technology", slug: "technology" },
      { _id: "cat-2", title: "Programming", slug: "programming" },
      { _id: "cat-3", title: "AI", slug: "ai" },
      { _id: "cat-4", title: "Web Dev", slug: "web-dev" },
    ];
  }

  // Default empty array
  return [];
}
