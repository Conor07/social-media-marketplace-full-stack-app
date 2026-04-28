import React from "react";
import { useAppDispatch } from "../app/hooks";
import { deleteCartItemThunk } from "../features/buy/cartSlice";
import type { ItemToSell } from "../types";

type CartListProps = {
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
  onPreviousPage: () => void;
  onNextPage: () => void;
};

const CartList: React.FC<CartListProps> = ({
  items,
  fetchStatus,
  fetchError,
  pagination,
  onPreviousPage,
  onNextPage,
}) => {
  const dispatch = useAppDispatch();

  const handleDeleteCart = (id: number) => {
    dispatch(deleteCartItemThunk(id));
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl">Your Cart:</h2>

      {fetchStatus === "loading" && <p>Loading cart items...</p>}

      {fetchStatus === "failed" && (
        <p style={{ color: "red" }}>Error: {fetchError}</p>
      )}

      {fetchStatus === "succeeded" && items.length === 0 && (
        <p>Your cart is empty.</p>
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

            <p>Quantity: {item.quantity}</p>

            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleDeleteCart(item.id)}
                className="h-full m-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                Remove from Cart
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

export default CartList;
