import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import {
  createCartItemThunk,
  deleteCartItemThunk,
  fetchCartItemsThunk,
  selectCartItems,

} from "../features/buy/cartSlice";
import type { ItemToSell } from "../types";
import { getAllAvailableItemsToSell } from "../api/itemsToSellApi";

type StoreProps = {};

const Store: React.FC<StoreProps> = ({}) => {
  const dispatch = useAppDispatch();

  const [availableItems, setAvailableItems] = useState<ItemToSell[]>([]);

  const [loadingItems, setLoadingItems] = useState(false);

  const [itemError, setItemError] = useState<string | null>(null);

  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const {
    cartItems,
    fetchStatus: cartFetchStatus,
    fetchError: cartFetchError,
  } = useSelector(selectCartItems);


  useEffect(() => {
    dispatch(fetchCartItemsThunk());

    loadAvailableItems();
  }, [dispatch]);

  const loadAvailableItems = async () => {
    setLoadingItems(true);

    setItemError(null);
    try {
      const items = await getAllAvailableItemsToSell();

      setAvailableItems(items);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch items";

      setItemError(message);
    } finally {
      setLoadingItems(false);
    }
  };

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
    );

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


  const handleDeleteCart = (id: number) => dispatch(deleteCartItemThunk(id));

  return (
    <div className="mb-4">
      <div>
        <h2>Available Items:</h2>
        {loadingItems && <p>Loading items...</p>}

        {itemError && <p style={{ color: "red" }}>Error: {itemError}</p>}

        {availableItems.length === 0 && !loadingItems && (
          <p>No items available.</p>
        )}

        {availableItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <h3>{item.name}</h3>

            <p>{item.description}</p>

            <p>Price: ${item.price}</p>

            <p>Available: {item.quantity}</p>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="number"
                min="1"
                max={item.quantity}
                value={quantities[item.id] || 1}
                onChange={(e) => handleQuantityChange(item.id, e)}
                style={{ width: "60px" }}
              />

              <button onClick={() => handleAddToCart(item)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      <hr style={{ marginTop: "20px" }} />

      <div>
        <h2>Your Cart:</h2>

        {cartFetchStatus === "loading" && <p>Loading cart items...</p>}

        {cartFetchStatus === "failed" && (
          <p style={{ color: "red" }}>Error: {cartFetchError}</p>
        )}

        {cartFetchStatus === "succeeded" && cartItems.length === 0 && (
          <p>Your cart is empty.</p>
        )}

        {cartFetchStatus === "succeeded" &&
          cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "4px",
              }}
            >
              <h3>{item.name}</h3>

              <p>{item.description}</p>

              <p>Price: ${item.price}</p>

              <p>Quantity: {item.quantity}</p>

              <button onClick={() => handleDeleteCart(item.id)}>
                Remove from Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Store;
