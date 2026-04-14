import { Router } from "express";

const router = Router();

const INITIAL_POSTS = [
  {
    id: 1,
    title: "First Post",
    content: "This is the content of the first post.",
  },
  {
    id: 2,
    title: "Second Post",
    content: "This is the content of the second post.",
  },
];

router.get("/", (_, res) => {
  res.json(INITIAL_POSTS);
});

router.post("/", (req, res) => {
  const { title, content } = req.body;

  if (!title || title.trim() === "" || !content || content.trim() === "") {
    return res.status(400).json({ error: "Title and content are required" });
  }

  const newPost = {
    id: INITIAL_POSTS.length + 1,
    title,
    content,
  };

  INITIAL_POSTS.push(newPost);

  res.status(201).json(newPost);
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const postIndex = INITIAL_POSTS.findIndex((post) => post.id === parseInt(id));

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  if (!title || title.trim() === "" || !content || content.trim() === "") {
    return res.status(400).json({ error: "Title and content are required" });
  }

  INITIAL_POSTS[postIndex] = { id: parseInt(id), title, content };

  res.status(200).json(INITIAL_POSTS[postIndex]);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const postIndex = INITIAL_POSTS.findIndex((post) => post.id === parseInt(id));

  if (postIndex === -1) {
    return res.status(404).json({ error: "Post not found" });
  }

  // const deletedPost = INITIAL_POSTS.splice(postIndex, 1);

  res.status(204).send();
});

export default router;
