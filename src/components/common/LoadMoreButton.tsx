"use client";

import { useState } from "react";

interface LoadMoreButtonProps {
  initialPage: number;
  initialItems: any[];
  totalItems: number;
  itemsPerPage: number;
  apiEndpoint: string;
  onItemsLoaded?: (newItems: any[]) => void;
}

const LoadMoreButton = ({
  initialPage,
  initialItems,
  totalItems,
  itemsPerPage,
  apiEndpoint,
  onItemsLoaded,
}: LoadMoreButtonProps) => {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  const hasMoreItems = items.length < totalItems;

  const loadMoreItems = async () => {
    if (!hasMoreItems || loading) return;

    setLoading(true);
    const nextPage = page + 1;

    try {
      const separator = apiEndpoint.includes("?") ? "&" : "?";
      const response = await fetch(
        `${apiEndpoint}${separator}page=${nextPage}&limit=${itemsPerPage}`
      );
      const data = await response.json();

      const newItems = data.articles || [];
      const updatedItems = [...items, ...newItems];

      setItems(updatedItems);
      setPage(nextPage);

      if (onItemsLoaded) {
        onItemsLoaded(newItems);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMoreItems) return null;

  return (
    <div className="text-center">
      <button
        onClick={loadMoreItems}
        disabled={loading}
        className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 transition duration-300 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Load More"}
      </button>
    </div>
  );
};

export default LoadMoreButton;
