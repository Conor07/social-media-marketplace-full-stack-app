import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import {
  createCartItemThunk,
  deleteCartItemThunk,
  fetchCartItemsThunk,
  selectCartItems,
  updateCartItemThunk,
} from "../features/buy/cartSlice";
import type { CartItem } from "../types";

type StoreProps = {};

const Store: React.FC<StoreProps> = ({}) => {
  const dispatch = useAppDispatch();

  const {
    cartItems,
    fetchStatus: cartFetchStatus,
    fetchError: cartFetchError,
  } = useSelector(selectCartItems);

  const [cartForm, setCartForm] = useState<CartItem>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  useEffect(() => {
    dispatch(fetchCartItemsThunk());
  }, [dispatch]);

  const handleCartChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCartForm({ ...cartForm, [e.target.name]: e.target.value });
  const handleAddCart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      createCartItemThunk({
        id: 0, // ID will be set by backend
        name: cartForm.name,
        description: cartForm.description,
        price: Number(cartForm.price),
        quantity: Number(cartForm.quantity),
      }),
    );
    setCartForm({ id: 0, name: "", description: "", price: 0, quantity: 0 });
  };
  const handleUpdateCart = (item: CartItem) => {
    setCartForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
    });
  };
  const handleSubmitUpdateCart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updateCartItemThunk({
        id: Number(cartForm.id),
        name: cartForm.name,
        description: cartForm.description,
        price: Number(cartForm.price),
        quantity: Number(cartForm.quantity),
      }),
    );
    setCartForm({ id: 0, name: "", description: "", price: 0, quantity: 0 });
  };

  const handleDeleteCart = (id: number) => dispatch(deleteCartItemThunk(id));

  return (
    <div className="mb-4">
      <h2>Cart Items: </h2>
      <form
        onSubmit={cartForm.id ? handleSubmitUpdateCart : handleAddCart}
        style={{ marginBottom: 8 }}
      >
        <input
          name="name"
          placeholder="Name"
          value={cartForm.name}
          onChange={handleCartChange}
          required
        />
        <input
          name="description"
          placeholder="Description"
          value={cartForm.description}
          onChange={handleCartChange}
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={cartForm.price}
          onChange={handleCartChange}
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={cartForm.quantity}
          onChange={handleCartChange}
          required
        />
        {cartForm.id ? (
          <>
            <button type="submit">Update Cart Item</button>
            <button
              type="button"
              onClick={() =>
                setCartForm({
                  id: 0,
                  name: "",
                  description: "",
                  price: 0,
                  quantity: 0,
                })
              }
            >
              Cancel
            </button>
          </>
        ) : (
          <button type="submit">Add Cart Item</button>
        )}
      </form>
      {cartFetchStatus === "loading" && <p>Loading cart items...</p>}
      {cartFetchStatus === "failed" && (
        <p style={{ color: "red" }}>Error: {cartFetchError}</p>
      )}
      {cartFetchStatus === "succeeded" && cartItems.length === 0 && (
        <p>No cart items found.</p>
      )}
      {cartFetchStatus === "succeeded" &&
        cartItems.map((item) => (
          <div key={item.id}>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleUpdateCart(item)}>Edit</button>
            <button onClick={() => handleDeleteCart(item.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default Store;
