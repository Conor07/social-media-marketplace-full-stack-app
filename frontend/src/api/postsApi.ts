import type { Post } from "../types";

export const getPosts = async (): Promise<Post[]> => {
  const response = await fetch("/api/posts");

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
};

export const createPost = async (post: Post): Promise<Post> => {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  // Get error message returned by api:
  if (
    response.status === 400 &&
    response.headers.get("Content-Type")?.includes("application/json")
  ) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export const updatePost = async (post: Post): Promise<Post> => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });

  // Get error message returned by api:
  if (
    response.status === 400 &&
    response.headers.get("Content-Type")?.includes("application/json")
  ) {
    const errorData = await response.json();

    throw new Error(errorData.error);
  }

  if (!response.ok) {
    throw new Error("Failed to update post");
  }

  return response.json();
};

export const deletePost = async (id: number): Promise<void> => {
  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete post");
  }
};

export const postsApi = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
