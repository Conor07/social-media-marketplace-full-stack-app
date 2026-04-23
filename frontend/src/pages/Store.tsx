import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import {
  createCartItemThunk,
  deleteCartItemThunk,
  fetchCartItemsThunk,
  selectCartItems,
} from "../features/buy/cartSlice";
import {
  fetchItemsToSellThunk,
  selectItemsToSell,
} from "../features/sell/itemsSlice";
import type { ItemToSell } from "../types";

type StoreProps = {};

const Store: React.FC<StoreProps> = ({}) => {
  const dispatch = useAppDispatch();

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const {
    cartItems,
    pagination: cartPagination,
    fetchStatus: cartFetchStatus,
    fetchError: cartFetchError,
  } = useSelector(selectCartItems);

  const {
    itemsToSell: availableItems,
    availableItemsPagination,
    fetchStatus: availableItemsFetchStatus,
    fetchError: availableItemsFetchError,
  } = useSelector(selectItemsToSell);

  useEffect(() => {
    dispatch(fetchCartItemsThunk());

    dispatch(fetchItemsToSellThunk());
  }, [dispatch]);

  const handleAddToCart = (item: ItemToSell) => {
    const quantity = quantities[item.id] || 1;

    dispatch(
      createCartItemThunk({
        id: 0,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity,
        userId: "",
      }),
    ).then(() => {
      dispatch(fetchCartItemsThunk());
    });

    setQuantities({ ...quantities, [item.id]: 1 });
  };

  const handleQuantityChange = (
    itemId: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuantities({
      ...quantities,
      [itemId]: Math.max(1, parseInt(e.target.value) || 1),
    });
  };

  const handleDeleteCart = (id: number) => {
    dispatch(deleteCartItemThunk(id)).then(() => {
      dispatch(fetchCartItemsThunk());
    });
  };

  const handlePreviousAvailablePage = () => {
    if (availableItemsPagination.hasPreviousPage) {
      const newPage = availableItemsPagination.page - 1;

      dispatch(fetchItemsToSellThunk(newPage));
    }
  };

  const handleNextAvailablePage = () => {
    if (availableItemsPagination.hasNextPage) {
      const newPage = availableItemsPagination.page + 1;

      dispatch(fetchItemsToSellThunk(newPage));
    }
  };

  const handlePreviousCartPage = () => {
    if (cartPagination.hasPreviousPage) {
      const newPage = cartPagination.page - 1;

      dispatch(fetchCartItemsThunk(newPage));
    }
  };

  const handleNextCartPage = () => {
    if (cartPagination.hasNextPage) {
      const newPage = cartPagination.page + 1;

      dispatch(fetchCartItemsThunk(newPage));
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center p-4 min-h-screen bg-gray-100 gap-4">
      <div className="w-full">
        <h2 className="text-2xl">Available Items:</h2>
        {availableItemsFetchStatus === "loading" && <p>Loading items...</p>}

        {availableItemsFetchStatus === "failed" && (
          <p style={{ color: "red" }}>Error: {availableItemsFetchError}</p>
        )}

        {availableItemsFetchStatus === "succeeded" &&
          availableItems.length === 0 && <p>No items available.</p>}

        {availableItemsFetchStatus === "succeeded" &&
          Array.isArray(availableItems) &&
          availableItems.map((item) => (
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
                  onChange={(e) => handleQuantityChange(item.id, e)}
                  className="w-16 p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

        {availableItemsFetchStatus === "succeeded" &&
          availableItems.length > 0 && (
            <div className="mt-8 flex gap-4 justify-center items-center">
              <button
                onClick={handlePreviousAvailablePage}
                disabled={!availableItemsPagination.hasPreviousPage}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {availableItemsPagination.page} of{" "}
                {availableItemsPagination.totalPages} (Total:{" "}
                {availableItemsPagination.total})
              </span>
              <button
                onClick={handleNextAvailablePage}
                disabled={!availableItemsPagination.hasNextPage}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
      </div>

      <hr className="w-full my-8" />

      <div className="w-full">
        <h2 className="text-2xl">Your Cart:</h2>

        {cartFetchStatus === "loading" && <p>Loading cart items...</p>}

        {cartFetchStatus === "failed" && (
          <p style={{ color: "red" }}>Error: {cartFetchError}</p>
        )}

        {cartFetchStatus === "succeeded" && cartItems.length === 0 && (
          <p>Your cart is empty.</p>
        )}

        {cartFetchStatus === "succeeded" &&
          Array.isArray(cartItems) &&
          cartItems.map((item) => (
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

        {cartFetchStatus === "succeeded" && cartItems.length > 0 && (
          <div className="mt-8 flex gap-4 justify-center items-center">
            <button
              onClick={handlePreviousCartPage}
              disabled={!cartPagination.hasPreviousPage}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {cartPagination.page} of {cartPagination.totalPages} (Total:{" "}
              {cartPagination.total})
            </span>
            <button
              onClick={handleNextCartPage}
              disabled={!cartPagination.hasNextPage}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
