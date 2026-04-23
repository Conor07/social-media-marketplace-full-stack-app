import React, { useEffect, useState } from "react";
import {
  fetchUserItemsToSellThunk,
  createItemToSellThunk,
  deleteItemToSellThunk,
  selectItemsToSell,
  updateItemToSellThunk,
} from "../features/sell/itemsSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import type { ItemToSell } from "../types";

type ItemsToSellProps = {};

const ITEMS_PER_PAGE = 5;

const ItemsToSell: React.FC<ItemsToSellProps> = ({}) => {
  const dispatch = useAppDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const {
    itemsToSell,
    fetchStatus: itemsFetchStatus,
    fetchError: itemsFetchError,
  } = useSelector(selectItemsToSell);

  const [itemForm, setItemForm] = useState<ItemToSell>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
    userId: "",
  });

  useEffect(() => {
    dispatch(fetchUserItemsToSellThunk());
  }, [dispatch]);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });

  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      createItemToSellThunk({
        id: 0,
        name: itemForm.name,
        description: itemForm.description,
        price: Number(itemForm.price),
        quantity: Number(itemForm.quantity),
      }),
    ).then(() => {
      dispatch(fetchUserItemsToSellThunk());
    });

    setItemForm({
      id: 0,
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      userId: "",
    });
  };

  const handleUpdateItem = (item: ItemToSell) => {
    setItemForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
      userId: item.userId,
    });
  };

  const handleSubmitUpdateItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(
      updateItemToSellThunk({
        id: Number(itemForm.id),
        name: itemForm.name,
        description: itemForm.description,
        price: Number(itemForm.price),
        quantity: Number(itemForm.quantity),
      }),
    );

    setItemForm({
      id: 0,
      name: "",
      description: "",
      price: 0,
      quantity: 0,
      userId: "",
    });
  };

  const handleDeleteItem = (id: number) => {
    dispatch(deleteItemToSellThunk(id)).then(() => {
      dispatch(fetchUserItemsToSellThunk());
    });
  };

  const { userItemsPagination } = useSelector(selectItemsToSell);

  const handlePreviousPage = () => {
    if (userItemsPagination.hasPreviousPage) {
      const newPage = userItemsPagination.page - 1;

      dispatch(fetchUserItemsToSellThunk(newPage));

      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (userItemsPagination.hasNextPage) {
      const newPage = userItemsPagination.page + 1;

      dispatch(fetchUserItemsToSellThunk(newPage));

      setCurrentPage(newPage);
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center p-4 min-h-screen bg-gray-100 gap-4">
      <h2 className="text-2xl">Items to Sell:</h2>

      <form
        onSubmit={itemForm.id ? handleSubmitUpdateItem : handleAddItem}
        className="flex flex-col gap-4 border-gray-400 border rounded p-4 w-full max-w-md bg-white"
      >
        <input
          name="name"
          placeholder="Name"
          value={itemForm.name}
          onChange={handleItemChange}
          required
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />

        <input
          name="description"
          placeholder="Description"
          value={itemForm.description}
          onChange={handleItemChange}
          required
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={itemForm.price}
          onChange={handleItemChange}
          required
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={itemForm.quantity}
          onChange={handleItemChange}
          required
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />

        {itemForm.id ? (
          <>
            <button
              type="submit"
              className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              Update Item
            </button>

            <button
              type="button"
              className="m-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
              onClick={() =>
                setItemForm({
                  id: 0,
                  name: "",
                  description: "",
                  price: 0,
                  quantity: 0,
                  userId: "",
                })
              }
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="submit"
            className="m-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            Add Item
          </button>
        )}
      </form>

      {itemsFetchStatus === "loading" && <p>Loading items to sell...</p>}

      {itemsFetchStatus === "failed" && (
        <p style={{ color: "red" }}>Error: {itemsFetchError}</p>
      )}

      {itemsFetchStatus === "succeeded" && itemsToSell.length === 0 && (
        <p>No items to sell found.</p>
      )}

      {itemsFetchStatus === "succeeded" &&
        Array.isArray(itemsToSell) &&
        itemsToSell.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 w-full border border-gray-400 rounded bg-white"
          >
            <h3 className="text-xl">{item.name}</h3>

            <p>{item.description}</p>

            <p>Price: ${item.price}</p>

            <p>Quantity: {item.quantity}</p>

            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => handleUpdateItem(item)}
                className="h-full m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="h-full m-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      {itemsFetchStatus === "succeeded" && itemsToSell.length > 0 && (
        <div className="mt-8 flex gap-4 justify-center items-center">
          <button
            onClick={handlePreviousPage}
            disabled={!userItemsPagination.hasPreviousPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {userItemsPagination.page} of {userItemsPagination.totalPages}{" "}
            (Total: {userItemsPagination.total})
          </span>
          <button
            onClick={handleNextPage}
            disabled={!userItemsPagination.hasNextPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemsToSell;
