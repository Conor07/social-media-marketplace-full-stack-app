import React from "react";
import type { ItemToSell } from "../types";

type AvailableItemsListProps = {
  items: ItemToSell[];
  fetchStatus: string;
  fetchError: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  quantities: Record<number, number>;
  onQuantityChange: (
    itemId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onAddToCart: (item: ItemToSell) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

const AvailableItemsList: React.FC<AvailableItemsListProps> = ({
  items,
  fetchStatus,
  fetchError,
  pagination,
  quantities,
  onQuantityChange,
  onAddToCart,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl">Available Items:</h2>
      {fetchStatus === "loading" && <p>Loading items...</p>}

      {fetchStatus === "failed" && (
        <p style={{ color: "red" }}>Error: {fetchError}</p>
      )}

      {fetchStatus === "succeeded" && items.length === 0 && (
        <p>No items available.</p>
      )}

      {fetchStatus === "succeeded" &&
        Array.isArray(items) &&
        items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 w-full border border-gray-400 rounded bg-white mb-4"
          >
            <h3 className="text-xl">{item.name}</h3>

            <p>{item.description}</p>

            <p>Price: ${item.price}</p>

            <p>Available: {item.quantity}</p>

            <div className="flex items-center gap-4 mt-2">
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={quantities[item.id] || 1}
                onChange={(e) => onQuantityChange(item.id, e)}
                className="w-16 p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                onClick={() => onAddToCart(item)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}

      {fetchStatus === "succeeded" && items.length > 0 && (
        <div className="mt-8 flex gap-4 justify-center items-center">
          <button
            onClick={onPreviousPage}
            disabled={!pagination.hasPreviousPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.page} of {pagination.totalPages} (Total:{" "}
            {pagination.total})
          </span>
          <button
            onClick={onNextPage}
            disabled={!pagination.hasNextPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableItemsList;
