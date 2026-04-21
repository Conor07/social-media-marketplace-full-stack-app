import { useAppDispatch, useAuth } from "../app/hooks";
import React, { useEffect, useState } from "react";
import {
  createPostThunk,
  deletePostThunk,
  fetchPostsThunk,
  selectPosts,
  updatePostThunk,
  likePostThunk,
} from "../features/posts/postsSlice";
import { useSelector } from "react-redux";
import type { Post } from "../types";

type PostsProps = {};

const Posts: React.FC<PostsProps> = ({}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [postForm, setPostForm] = useState<Post>({
    id: 0,
    title: "",
    content: "",
    userId: "",
    likes: [],
  });

  const {
    posts,
    fetchStatus: postsFetchStatus,
    fetchError: postsFetchError,
  } = useSelector(selectPosts);

  useEffect(() => {
    dispatch(fetchPostsThunk());
  }, [dispatch]);

  const handlePostChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setPostForm({ ...postForm, [e.target.name]: e.target.value });

  const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      createPostThunk({
        id: 0,
        title: postForm.title,
        content: postForm.content,
      }),
    );
    setPostForm({ id: 0, title: "", content: "", userId: "", likes: [] });
  };

  const handleUpdatePost = (post: Post) => {
    setPostForm({
      id: post.id,
      title: post.title,
      content: post.content,
      userId: post.userId,
      likes: post.likes,
    });
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
    setPostForm({ id: 0, title: "", content: "", userId: "", likes: [] });
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
              onClick={() =>
                setPostForm({
                  id: 0,
                  title: "",
                  content: "",
                  userId: "",
                  likes: [],
                })
              }
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
        posts.map((post) => {
          const liked = user && post.likes.includes(user.userId);

          const isOwner = user && post.userId === user.userId;
          return (
            <div key={post.id}>
              <h3>{post.title}</h3>

              <p>{post.content}</p>

              <div>
                <button
                  onClick={() => dispatch(likePostThunk(post.id))}
                  style={{ color: liked ? "red" : undefined }}
                >
                  {liked ? "Unlike" : "Like"} ({post.likes.length})
                </button>

                {isOwner && (
                  <>
                    <button onClick={() => handleUpdatePost(post)}>Edit</button>

                    <button onClick={() => handleDeletePost(post.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Posts;
