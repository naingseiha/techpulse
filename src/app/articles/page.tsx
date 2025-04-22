import { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Manage Articles | Admin Dashboard",
  description: "Manage articles on your TechPulse website",
};

// This would actually fetch from your MongoDB database
async function getArticles() {
  return []; // Placeholder - will be replaced with actual data
}

export default async function ArticlesPage() {
  // Get the current session
  const session = await getServerSession();

  // Check if user is logged in and has admin role
  if (!session || session.user?.role !== "admin") {
    redirect("/auth/signin?callbackUrl=/admin/articles");
  }

  const articles = await getArticles();

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Articles</h1>
            <p className="text-gray-600">Manage your blog articles</p>
          </div>
          <Link
            href="/admin/articles/new"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition flex items-center gap-2"
          >
            <FaPlus size={14} />
            New Article
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                placeholder="Search articles..."
                className="px-4 py-2 border rounded-md w-full md:w-64"
              />
              <select className="px-4 py-2 border rounded-md">
                <option value="">All Categories</option>
                <option value="technology">Technology</option>
                <option value="programming">Programming</option>
                <option value="ai">AI</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {articles.length > 0 ? (
                    articles.map((article) => (
                      <tr key={article._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {article.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {article.author.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {article.category.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {format(
                            new Date(article.publishedAt),
                            "MMM dd, yyyy"
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/articles/${article.slug}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View"
                            >
                              <FaEye />
                            </Link>
                            <Link
                              href={`/admin/articles/${article._id}/edit`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit"
                            >
                              <FaEdit />
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No articles found. Create your first article to get
                        started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
