import { Router } from "express";

const router = Router();

const ITEMS: {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
}[] = [
  {
    id: 1,
    name: "Item 1",
    description: "Description 1",
    price: 10,
    quantity: 5,
  },
  {
    id: 2,
    name: "Item 2",
    description: "Description 2",
    price: 20,
    quantity: 3,
  },
];

router.get("/", (_, res) => {
  res.json(ITEMS);
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
    id: ITEMS.length ? Math.max(...ITEMS.map((i) => i.id)) + 1 : 1,
    name,
    description,
    price,
    quantity,
  };
  ITEMS.push(newItem);
  res.status(201).json(newItem);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  const idx = ITEMS.findIndex((item) => item.id === parseInt(id));
  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
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
  ITEMS[idx] = { id: parseInt(id), name, description, price, quantity };
  res.status(200).json(ITEMS[idx]);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const idx = ITEMS.findIndex((item) => item.id === parseInt(id));

  if (idx === -1) {
    return res.status(404).json({ error: "Item not found" });
  }

  ITEMS.splice(idx, 1);

  res.status(204).send();
});

export default router;
