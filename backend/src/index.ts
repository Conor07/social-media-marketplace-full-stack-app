import express from "express";
import itemsToSellRouter from "./routes/itemsToSell.js";
import cartRouter from "./routes/cart.js";
import postsRouter from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/itemsToSell", itemsToSellRouter);
app.use("/api/cart", cartRouter);
app.use("/api/posts", postsRouter);

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
