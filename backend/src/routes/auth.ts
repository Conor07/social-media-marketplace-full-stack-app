import express from "express";
import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import type { AuthenticatedRequest, AuthUser } from "../types/auth.js";

const router = express.Router();

export const users: Array<{
  userId: string;
  username: string;
  password: string;
}> = [];

async function initializeUsers() {
  if (users.length === 0) {
    const testUsers = [
      { username: "alice", password: "alicepw", userId: "user-1" },
      { username: "bob", password: "bobpw", userId: "user-2" },
    ];

    for (const testUser of testUsers) {
      const hashedPassword = await bcrypt.hash(testUser.password, 10);

      users.push({
        userId: testUser.userId,
        username: testUser.username,
        password: hashedPassword,
      });
    }
  }
}

initializeUsers();

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/seed", async (req, res) => {
  users.length = 0;

  const testUsers = [
    { username: "alice", password: "alicepw", userId: "user-1" },
    { username: "bob", password: "bobpw", userId: "user-2" },
  ];

  for (const testUser of testUsers) {
    const hashedPassword = await bcrypt.hash(testUser.password, 10);

    users.push({
      userId: testUser.userId,
      username: testUser.username,
      password: hashedPassword,
    });
  }

  res.json({
    message: "Test users seeded successfully",
    users: users.map((u) => ({ userId: u.userId, username: u.username })),
  });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = { userId: uuidv4(), username, password: hashedPassword };

  users.push(user);

  res.status(201).json({ message: "User registered" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.userId, username: user.username },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.json({ token, userId: user.userId, username: user.username });
});

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);

    req.user = user as AuthUser;

    next();
  });
};

router.get(
  "/me",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    res.json({ userId: req.user?.userId, username: req.user?.username });
  },
);

export default router;
