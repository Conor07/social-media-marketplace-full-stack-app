import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from the items to sell route!");
});

export default router;
