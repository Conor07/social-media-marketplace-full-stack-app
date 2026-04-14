import { Router } from "express";

const router = Router();

const CART: {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}[] = [
  {
    id: 1,
    name: "Cart Item 1",
    description: "Description 1",
    price: 15,
    quantity: 2,
  },
  {
    id: 2,
    name: "Cart Item 2",
    description: "Description 2",
    price: 25,
    quantity: 1,
  },
];

router.get("/", (_, res) => {
  res.json(CART);
});

router.post("/", (req, res) => {
  const { name, description, price, quantity } = req.body;
  if (
    !name ||
    !description ||
    typeof price !== "number" ||
    typeof quantity !== "number"
  ) {
    return res
      .status(400)
      .json({ error: "Name, description, price, and quantity are required" });
  }
  const newItem = {
    id: CART.length ? Math.max(...CART.map((i) => i.id)) + 1 : 1,
    name,
    description,
    price,
    quantity,
  };
  CART.push(newItem);
  res.status(201).json(newItem);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  const idx = CART.findIndex((item) => item.id === parseInt(id));
  if (idx === -1) {
    return res.status(404).json({ error: "Cart item not found" });
  }
  if (
    !name ||
    !description ||
    typeof price !== "number" ||
    typeof quantity !== "number"
  ) {
    return res
      .status(400)
      .json({ error: "Name, description, price, and quantity are required" });
  }
  CART[idx] = { id: parseInt(id), name, description, price, quantity };
  res.status(200).json(CART[idx]);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const idx = CART.findIndex((item) => item.id === parseInt(id));

  if (idx === -1) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  CART.splice(idx, 1);

  res.status(204).send();
});

export default router;
