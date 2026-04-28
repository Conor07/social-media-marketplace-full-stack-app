import React, { useEffect, useState } from "react";
import {
  fetchUserItemsToSellThunk,
  createItemToSellThunk,
  deleteItemToSellThunk,
  updateItemToSellThunk,
  selectItemsToSell,
} from "../features/sell/itemsSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/hooks";
import type { ItemToSell } from "../types";
import CreateItemForm from "../components/CreateItemForm";
import ItemsList from "../components/ItemsList";

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
    }
  };

  const handleNextPage = () => {
    if (userItemsPagination.hasNextPage) {
      const newPage = userItemsPagination.page + 1;

      dispatch(fetchUserItemsToSellThunk(newPage));
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center p-4 min-h-screen bg-gray-100 gap-4">
      <h2 className="text-2xl">Items to Sell:</h2>

      <CreateItemForm
        itemForm={itemForm}
        onItemChange={handleItemChange}
        onAddItem={handleAddItem}
        onSubmitUpdateItem={handleSubmitUpdateItem}
        onCancel={() =>
          setItemForm({
            id: 0,
            name: "",
            description: "",
            price: 0,
            quantity: 0,
            userId: "",
          })
        }
      />

      <ItemsList
        items={itemsToSell}
        fetchStatus={itemsFetchStatus}
        fetchError={itemsFetchError}
        pagination={userItemsPagination}
        onEditItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default ItemsToSell;
