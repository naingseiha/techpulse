"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch data for users, articles, and categories
    fetchUsers();
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/admin/articles");
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Users</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Role</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Articles</h2>
        <div className="mb-4">
          <Link
            href="/admin/articles/new"
            className="text-blue-500 hover:underline"
          >
            Add New Article
          </Link>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Title</th>
              <th className="border border-gray-300 px-4 py-2">Author</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {article.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {article.author.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {article.category.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="mb-4">
          <Link
            href="/admin/categories/new"
            className="text-blue-500 hover:underline"
          >
            Add New Category
          </Link>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td className="border border-gray-300 px-4 py-2">
                  {category.title}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
