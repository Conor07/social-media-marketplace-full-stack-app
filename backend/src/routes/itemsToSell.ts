import { Router } from "express";
import type { Response } from "express";
import { authenticateToken } from "./auth.js";
import type { AuthenticatedRequest } from "../types/auth.js";

const router = Router();

const ITEMS: {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  userId: string;
}[] = [
  {
    id: 1,
    name: "Item 1",
    description: "Description 1",
    price: 10,
    quantity: 5,
    userId: "user-1",
  },
  {
    id: 2,
    name: "Item 2",
    description: "Description 2",
    price: 20,
    quantity: 3,
    userId: "user-2",
  },
];

router.get(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const userItems = ITEMS.filter((item) => item.userId === req.user!.userId);

    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    const limit = 5;

    const start = (page - 1) * limit;

    const paginatedItems = userItems.slice(start, start + limit);

    const total = userItems.length;

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  },
);

router.get(
  "/available/all",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const availableItems = ITEMS.filter(
      (item) => item.userId !== req.user!.userId,
    );
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = 5;
    const start = (page - 1) * limit;
    const paginatedItems = availableItems.slice(start, start + limit);
    const total = availableItems.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      data: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
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
      id: ITEMS.length ? Math.max(...ITEMS.map((i) => i.id)) + 1 : 1,
      name,
      description,
      price,
      quantity,
      userId: req.user!.userId,
    };

    ITEMS.push(newItem);

    res.status(201).json(newItem);
  },
);

router.put(
  "/:id",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const { name, description, price, quantity } = req.body;

    const idx = ITEMS.findIndex((item) => item.id === parseInt(id));

    if (idx === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (ITEMS[idx].userId !== req.user!.userId) {
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

    ITEMS[idx] = { ...ITEMS[idx], name, description, price, quantity };

    res.status(200).json(ITEMS[idx]);
  },
);

router.delete(
  "/:id",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const idx = ITEMS.findIndex((item) => item.id === parseInt(id));

    if (idx === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (ITEMS[idx].userId !== req.user!.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    ITEMS.splice(idx, 1);

    res.status(204).send();
  },
);

export default router;
