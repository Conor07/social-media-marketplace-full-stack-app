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

const ItemsToSell: React.FC<ItemsToSellProps> = ({}) => {
  const dispatch = useAppDispatch();

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

  const handleDeleteItem = (id: number) => dispatch(deleteItemToSellThunk(id));

  return (
    <div className="mb-4">
      <h2>Items to Sell: </h2>

      <form
        onSubmit={itemForm.id ? handleSubmitUpdateItem : handleAddItem}
        style={{ marginBottom: 8 }}
      >
        <input
          name="name"
          placeholder="Name"
          value={itemForm.name}
          onChange={handleItemChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={itemForm.description}
          onChange={handleItemChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={itemForm.price}
          onChange={handleItemChange}
          required
        />

        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={itemForm.quantity}
          onChange={handleItemChange}
          required
        />

        {itemForm.id ? (
          <>
            <button type="submit">Update Item</button>

            <button
              type="button"
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
          <button type="submit">Add Item</button>
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
        itemsToSell.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>

            <p>{item.description}</p>

            <p>Price: ${item.price}</p>

            <p>Quantity: {item.quantity}</p>

            <button onClick={() => handleUpdateItem(item)}>Edit</button>

            <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default ItemsToSell;
