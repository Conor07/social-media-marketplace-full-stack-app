import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./app/hooks";
import {
  fetchItemsToSellThunk,
  createItemToSellThunk,
  updateItemToSellThunk,
  deleteItemToSellThunk,
  selectItemsToSell,
} from "./features/sell/itemsSlice";
import {
  fetchCartItemsThunk,
  createCartItemThunk,
  updateCartItemThunk,
  deleteCartItemThunk,
  selectCartItems,
} from "./features/buy/cartSlice";
import {
  fetchPostsThunk,
  createPostThunk,
  updatePostThunk,
  deletePostThunk,
  selectPosts,
} from "./features/posts/postsSlice";
import type { CartItem, ItemToSell, Post } from "./types";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    itemsToSell,
    fetchStatus: itemsFetchStatus,
    fetchError: itemsFetchError,
  } = useSelector(selectItemsToSell);

  const {
    cartItems,
    fetchStatus: cartFetchStatus,
    fetchError: cartFetchError,
  } = useSelector(selectCartItems);

  const {
    posts,
    fetchStatus: postsFetchStatus,
    fetchError: postsFetchError,
  } = useSelector(selectPosts);

  // Local state for forms
  const [postForm, setPostForm] = useState<Post>({
    id: 0,
    title: "",
    content: "",
  });
  const [itemForm, setItemForm] = useState<ItemToSell>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });
  const [cartForm, setCartForm] = useState<CartItem>({
    id: 0,
    name: "",
    description: "",
    price: 0,
    quantity: 0,
  });

  useEffect(() => {
    dispatch(fetchPostsThunk());
    dispatch(fetchItemsToSellThunk());
    dispatch(fetchCartItemsThunk());
  }, [dispatch]);

  // Handlers for posts
  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setPostForm({ ...postForm, [e.target.name]: e.target.value });
  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      createPostThunk({
        id: 0, // ID will be set by backend
        title: postForm.title,
        content: postForm.content,
      }),
    );
    setPostForm({ id: 0, title: "", content: "" });
  };
  const handleUpdatePost = (post: Post) => {
    setPostForm({ id: post.id, title: post.title, content: post.content });
  };
  const handleSubmitUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updatePostThunk({
        id: Number(postForm.id),
        title: postForm.title,
        content: postForm.content,
      }),
    );
    setPostForm({ id: 0, title: "", content: "" });
  };
  const handleDeletePost = (id: number) => dispatch(deletePostThunk(id));

  // Handlers for items to sell
  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setItemForm({ ...itemForm, [e.target.name]: e.target.value });
  const handleAddItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      createItemToSellThunk({
        id: 0, // ID will be set by backend
        name: itemForm.name,
        description: itemForm.description,
        price: Number(itemForm.price),
        quantity: Number(itemForm.quantity),
      }),
    );
    setItemForm({ id: 0, name: "", description: "", price: 0, quantity: 0 });
  };
  const handleUpdateItem = (item: ItemToSell) => {
    setItemForm({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity,
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
    setItemForm({ id: 0, name: "", description: "", price: 0, quantity: 0 });
  };
  const handleDeleteItem = (id: number) => dispatch(deleteItemToSellThunk(id));

  // Handlers for cart
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
    <div>
      <div className="mb-4">
        <h2>Posts: </h2>
        <form
          onSubmit={postForm.id ? handleSubmitUpdatePost : handleAddPost}
          style={{ marginBottom: 8 }}
        >
          <input
            name="title"
            placeholder="Title"
            value={postForm.title}
            onChange={handlePostChange}
            required
          />
          <input
            name="content"
            placeholder="Content"
            value={postForm.content}
            onChange={handlePostChange}
            required
          />
          {postForm.id ? (
            <>
              <button type="submit">Update Post</button>
              <button
                type="button"
                onClick={() => setPostForm({ id: 0, title: "", content: "" })}
              >
                Cancel
              </button>
            </>
          ) : (
            <button type="submit">Add Post</button>
          )}
        </form>
        {postsFetchStatus === "loading" && <p>Loading posts...</p>}
        {postsFetchStatus === "failed" && (
          <p style={{ color: "red" }}>Error: {postsFetchError}</p>
        )}
        {postsFetchStatus === "succeeded" && posts.length === 0 && (
          <p>No posts found.</p>
        )}
        {postsFetchStatus === "succeeded" &&
          posts.map((post) => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <button onClick={() => handleUpdatePost(post)}>Edit</button>
              <button onClick={() => handleDeletePost(post.id)}>Delete</button>
            </div>
          ))}
      </div>

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
    </div>
  );
};

export default App;
