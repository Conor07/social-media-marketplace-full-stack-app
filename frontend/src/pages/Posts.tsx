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
import { FaHeart } from "react-icons/fa";

type PostsProps = {};

const POSTS_PER_PAGE = 5;

const Posts: React.FC<PostsProps> = ({}) => {
  const dispatch = useAppDispatch();

  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);

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
    ).then(() => {
      dispatch(fetchPostsThunk(1));
    });

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

  const { pagination } = useSelector(selectPosts);

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      const newPage = pagination.page - 1;

      dispatch(fetchPostsThunk(newPage));

      setCurrentPage(newPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      const newPage = pagination.page + 1;

      dispatch(fetchPostsThunk(newPage));

      setCurrentPage(newPage);
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center p-4 min-h-screen bg-gray-100 gap-4 ">
      <h2 className="text-2xl">Posts: </h2>

      <form
        onSubmit={postForm.id ? handleSubmitUpdatePost : handleAddPost}
        style={{ marginBottom: 8 }}
        className="flex flex-col gap-4 border-gray-400 border rounded p-4 w-full max-w-md bg-white"
      >
        <input
          name="title"
          placeholder="Title"
          value={postForm.title}
          onChange={handlePostChange}
          required
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />

        <input
          name="content"
          placeholder="Content"
          value={postForm.content}
          onChange={handlePostChange}
          required
          className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        />

        {postForm.id ? (
          <>
            <button
              type="submit"
              className="m-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              Update Post
            </button>
            <button
              type="button"
              className="m-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
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
          <button
            type="submit"
            className="m-4 p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            Add Post
          </button>
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
        Array.isArray(posts) &&
        posts.length > 0 &&
        posts.map((post) => {
          const liked = user && post.likes.includes(user.userId);

          const isOwner = user && post.userId === user.userId;
          return (
            <div
              key={post.id}
              className="flex flex-col p-4 w-full border border-gray-400 rounded bg-white"
            >
              <h3 className="text-xl">{post.title}</h3>

              <p>{post.content}</p>

              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => dispatch(likePostThunk(post.id))}
                  style={{ color: liked ? "red" : undefined }}
                  className=" flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                >
                  <FaHeart
                    style={{ marginLeft: 4, color: liked ? "red" : "gray" }}
                  />
                  ({post.likes.length})
                </button>

                {isOwner && (
                  <>
                    <button
                      onClick={() => handleUpdatePost(post)}
                      className="h-full m-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="h-full m-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

      {postsFetchStatus === "succeeded" && posts.length > 0 && (
        <div className="mt-8 flex gap-4 justify-center items-center">
          <button
            onClick={handlePreviousPage}
            disabled={!pagination.hasPreviousPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {pagination.page} of {pagination.totalPages} (Total:{" "}
            {pagination.total})
          </span>
          <button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
