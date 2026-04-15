import { useAppDispatch } from "../app/hooks";
import React, { useEffect } from "react";
import {
  createPostThunk,
  deletePostThunk,
  fetchPostsThunk,
  selectPosts,
  updatePostThunk,
} from "../features/posts/postsSlice";
import { useSelector } from "react-redux";
import type { Post } from "../types";
import { useState } from "react";

type PostsProps = {};

const Posts: React.FC<PostsProps> = ({}) => {
  const dispatch = useAppDispatch();

  const [postForm, setPostForm] = useState<Post>({
    id: 0,
    title: "",
    content: "",
  });

  const {
    posts,
    fetchStatus: postsFetchStatus,
    fetchError: postsFetchError,
  } = useSelector(selectPosts);

  useEffect(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  // Handlers for posts
  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setPostForm({ ...postForm, [e.target.name]: e.target.value });
  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      createPostThunk({
        id: 0, // ID will be set by backend
        title: postForm.title,
        content: postForm.content,
      }),
    );
    setPostForm({ id: 0, title: "", content: "" });
  };
  const handleUpdatePost = (post: Post) => {
    setPostForm({ id: post.id, title: post.title, content: post.content });
  };
  const handleSubmitUpdatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      updatePostThunk({
        id: Number(postForm.id),
        title: postForm.title,
        content: postForm.content,
      }),
    );
    setPostForm({ id: 0, title: "", content: "" });
  };
  const handleDeletePost = (id: number) => dispatch(deletePostThunk(id));

  return (
    <div className="mb-4">
      <h2>Posts: </h2>
      <form
        onSubmit={postForm.id ? handleSubmitUpdatePost : handleAddPost}
        style={{ marginBottom: 8 }}
      >
        <input
          name="title"
          placeholder="Title"
          value={postForm.title}
          onChange={handlePostChange}
          required
        />
        <input
          name="content"
          placeholder="Content"
          value={postForm.content}
          onChange={handlePostChange}
          required
        />
        {postForm.id ? (
          <>
            <button type="submit">Update Post</button>
            <button
              type="button"
              onClick={() => setPostForm({ id: 0, title: "", content: "" })}
            >
              Cancel
            </button>
          </>
        ) : (
          <button type="submit">Add Post</button>
        )}
      </form>
      {postsFetchStatus === "loading" && <p>Loading posts...</p>}
      {postsFetchStatus === "failed" && (
        <p style={{ color: "red" }}>Error: {postsFetchError}</p>
      )}
      {postsFetchStatus === "succeeded" && posts.length === 0 && (
        <p>No posts found.</p>
      )}
      {postsFetchStatus === "succeeded" &&
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <button onClick={() => handleUpdatePost(post)}>Edit</button>
            <button onClick={() => handleDeletePost(post.id)}>Delete</button>
          </div>
        ))}
    </div>
  );
};

export default Posts;
