import { useSelector } from "react-redux";
import { selectItemsToSell } from "./features/sell/itemsSlice";
import { selectCartItems } from "./features/buy/cartSlice";
import { selectPosts } from "./features/posts/postsSlice";

function App() {
  const { itemsToSell } = useSelector(selectItemsToSell);

  const { cartItems } = useSelector(selectCartItems);

  const { posts } = useSelector(selectPosts);

  return (
    <div>
      <h2>Posts: </h2>

      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}

      <h2>Items to Sell: </h2>

      {itemsToSell.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}

      <h2>Cart Items: </h2>

      {cartItems.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
