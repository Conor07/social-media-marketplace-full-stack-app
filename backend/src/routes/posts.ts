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
  {
    id: 3,
    title: "Amazing New Product",
    content:
      "Check out this incredible new product I found! Perfect for everyday use.",
    userId: "user-1",
    likes: ["user-2"],
  },
  {
    id: 4,
    title: "Tips for Getting Started",
    content: "Here are my top 5 tips for beginners. Hope this helps!",
    userId: "user-3",
    likes: ["user-1", "user-2"],
  },
  {
    id: 5,
    title: "Community Spotlight",
    content:
      "Shoutout to all the amazing members of this marketplace. Keep being awesome!",
    userId: "user-2",
    likes: ["user-1"],
  },
  {
    id: 6,
    title: "Weekly Recommendations",
    content: "These are my favorite finds from this week. Worth checking out!",
    userId: "user-3",
    likes: [],
  },
  {
    id: 7,
    title: "How to Maximize Sales",
    content:
      "I've learned a lot about what works. Let me share my strategy with you.",
    userId: "user-4",
    likes: ["user-1", "user-3"],
  },
  {
    id: 8,
    title: "Tutorial: Getting the Best Deals",
    content: "Follow these steps to find the best bargains on the marketplace.",
    userId: "user-1",
    likes: ["user-2", "user-3", "user-4"],
  },
  {
    id: 9,
    title: "Success Story",
    content: "I started small and now I'm making great profit. You can too!",
    userId: "user-2",
    likes: ["user-1"],
  },
  {
    id: 10,
    title: "New Features Announcement",
    content: "Exciting updates coming to the platform next month. Stay tuned!",
    userId: "user-5",
    likes: ["user-1", "user-2", "user-3"],
  },
];

router.get(
  "/",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    const limit = 5;

    const sortedPosts = [...INITIAL_POSTS].sort((a, b) => b.id - a.id);

    const start = (page - 1) * limit;

    const paginatedPosts = sortedPosts.slice(start, start + limit);

    const total = sortedPosts.length;

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: paginatedPosts,
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
