import { Router } from "express";
import type { Response } from "express";
import { authenticateToken } from "./auth.js";
import type { AuthenticatedRequest } from "../types/auth.js";

const router = Router();

const CART: {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
}[] = [];

router.get(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    res.json(CART.filter((item) => item.userId === req.user!.userId));
  },
);

router.post(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
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
      userId: req.user!.userId,
    };

    CART.push(newItem);

    res.status(201).json(newItem);
  },
);

router.put(
  "/:id",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const { name, description, price, quantity } = req.body;

    const idx = CART.findIndex((item) => item.id === parseInt(id));

    if (idx === -1) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (CART[idx].userId !== req.user!.userId) {
      return res.status(403).json({ error: "Not authorized" });
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

    CART[idx] = { ...CART[idx], name, description, price, quantity };

    res.status(200).json(CART[idx]);
  },
);

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
