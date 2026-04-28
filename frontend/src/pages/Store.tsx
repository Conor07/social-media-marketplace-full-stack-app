import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { useSelector } from "react-redux";
import {
  createCartItemThunk,
  fetchCartItemsThunk,
  selectCartItems,
} from "../features/buy/cartSlice";
import {
  fetchItemsToSellThunk,
  selectItemsToSell,
} from "../features/sell/itemsSlice";
import type { ItemToSell } from "../types";
import AvailableItemsList from "../components/AvailableItemsList";
import CartList from "../components/CartList";

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
      <AvailableItemsList
        items={availableItems}
        fetchStatus={availableItemsFetchStatus}
        fetchError={availableItemsFetchError}
        pagination={availableItemsPagination}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
        onAddToCart={handleAddToCart}
        onPreviousPage={handlePreviousAvailablePage}
        onNextPage={handleNextAvailablePage}
      />

      <hr className="w-full my-8" />

      <CartList
        items={cartItems}
        fetchStatus={cartFetchStatus}
        fetchError={cartFetchError}
        pagination={cartPagination}
        onPreviousPage={handlePreviousCartPage}
        onNextPage={handleNextCartPage}
      />
    </div>
  );
};

export default Store;
