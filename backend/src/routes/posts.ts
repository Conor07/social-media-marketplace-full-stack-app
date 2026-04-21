import { Router } from "express";
import type { Response } from "express";
import { authenticateToken } from "./auth.js";
import type { AuthenticatedRequest } from "../types/auth.js";

const router = Router();

const INITIAL_POSTS: Array<{
  id: number;
  title: string;
  content: string;
  userId: string;
  likes: string[];
}> = [
  {
    id: 1,
    title: "First Post",
    content: "This is the content of the first post.",
    userId: "user-1",
    likes: [],
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the content of the second post.",
    userId: "user-2",
    likes: [],
  },
];

router.get(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    res.json(INITIAL_POSTS);
  },
);

router.post(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { title, content } = req.body;

    if (!title || title.trim() === "" || !content || content.trim() === "") {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newPost = {
      id: INITIAL_POSTS.length
        ? Math.max(...INITIAL_POSTS.map((p) => p.id)) + 1
        : 1,
      title,
      content,
      userId: req.user!.userId,
      likes: [],
    };

    INITIAL_POSTS.push(newPost);

    res.status(201).json(newPost);
  },
);

router.put(
  "/:id",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const { title, content } = req.body;

    const postIndex = INITIAL_POSTS.findIndex(
      (post) => post.id === parseInt(id),
    );

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (INITIAL_POSTS[postIndex].userId !== req.user!.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    if (!title || title.trim() === "" || !content || content.trim() === "") {
      return res.status(400).json({ error: "Title and content are required" });
    }

    INITIAL_POSTS[postIndex] = { ...INITIAL_POSTS[postIndex], title, content };

    res.status(200).json(INITIAL_POSTS[postIndex]);
  },
);

router.delete(
  "/:id",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const postIndex = INITIAL_POSTS.findIndex(
      (post) => post.id === parseInt(id),
    );

    if (postIndex === -1) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (INITIAL_POSTS[postIndex].userId !== req.user!.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    INITIAL_POSTS.splice(postIndex, 1);

    res.status(204).end();
  },
);

router.post(
  "/:id/like",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params as { id: string };

    const post = INITIAL_POSTS.find((p) => p.id === parseInt(id));

    if (!post) return res.status(404).json({ error: "Post not found" });

    const userId = req.user!.userId;

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);

      return res.json({ liked: true, likes: post.likes.length });
    } else {
      post.likes = post.likes.filter((uid) => uid !== userId);

      return res.json({ liked: false, likes: post.likes.length });
    }
  },
);

export default router;
