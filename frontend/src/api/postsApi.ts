import axios from "axios";
import type { Post, PaginatedResponse } from "../types";

export const getPosts = async (
  page: number = 1,
): Promise<PaginatedResponse<Post>> => {
  try {
    const res = await axios.get(`/posts?page=${page}`);

    return res.data;
  } catch (err) {
    throw err;
  }
};

export const createPost = async (post: Post): Promise<Post> => {
  try {
    const res = await axios.post("/posts", post);

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error(err.response.data?.error || "Failed to create post");
    }

    throw new Error("Failed to create post");
  }
};

export const updatePost = async (post: Post): Promise<Post> => {
  try {
    const res = await axios.put(`/posts/${post.id}`, post);

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 400) {
      throw new Error(err.response.data?.error || "Failed to update post");
    }

    throw new Error("Failed to update post");
  }
};

export const deletePost = async (id: number): Promise<void> => {
  await axios.delete(`/posts/${id}`);
};

export const likePost = async (
  id: number,
): Promise<{ liked: boolean; likes: number }> => {
  const res = await axios.post(`/posts/${id}/like`);

  return res.data;
};

export const postsApi = {
  getPosts,
  createPost,
  updatePost,
  deletePost,
};
