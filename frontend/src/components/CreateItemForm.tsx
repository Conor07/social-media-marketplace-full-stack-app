import React from "react";
import type { ItemToSell } from "../types";

type CreateItemFormProps = {
  itemForm: ItemToSell;
  onItemChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddItem: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmitUpdateItem: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

const CreateItemForm: React.FC<CreateItemFormProps> = ({
  itemForm,
  onItemChange,
  onAddItem,
  onSubmitUpdateItem,
  onCancel,
}) => {
  return (
    <form
      onSubmit={itemForm.id ? onSubmitUpdateItem : onAddItem}
      className="flex flex-col gap-4 border-gray-400 border rounded p-4 w-full max-w-md bg-white"
    >
      <input
        name="name"
        placeholder="Name"
        value={itemForm.name}
        onChange={onItemChange}
        required
        className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      />

      <input
        name="description"
        placeholder="Description"
        value={itemForm.description}
        onChange={onItemChange}
        required
        className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      />

      <input
        name="price"
        type="number"
        placeholder="Price"
        value={itemForm.price}
        onChange={onItemChange}
        required
        className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      />

      <input
        name="quantity"
        type="number"
        placeholder="Quantity"
        value={itemForm.quantity}
        onChange={onItemChange}
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
            onClick={onCancel}
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
  );
};

export default CreateItemForm;
