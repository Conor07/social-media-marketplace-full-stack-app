import React from "react";
import { useAppDispatch, useAuth } from "../app/hooks";
import { deletePostThunk, likePostThunk } from "../features/posts/postsSlice";
import type { Post } from "../types";
import { FaHeart } from "react-icons/fa";

type PostsListProps = {
  posts: Post[];
  fetchStatus: string;
  fetchError: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  onEditPost: (post: Post) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
};

const PostsList: React.FC<PostsListProps> = ({
  posts,
  fetchStatus,
  fetchError,
  pagination,
  onEditPost,
  onPreviousPage,
  onNextPage,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleDeletePost = (id: number) => dispatch(deletePostThunk(id));

  return (
    <>
      {fetchStatus === "loading" && <p>Loading posts...</p>}

      {fetchStatus === "failed" && (
        <p style={{ color: "red" }}>Error: {fetchError}</p>
      )}

      {fetchStatus === "succeeded" && posts.length === 0 && (
        <p>No posts found.</p>
      )}

      {fetchStatus === "succeeded" &&
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
                      onClick={() => onEditPost(post)}
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

      {fetchStatus === "succeeded" && posts.length > 0 && (
        <div className="mt-8 flex gap-4 justify-center items-center">
          <button
            onClick={onPreviousPage}
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
            onClick={onNextPage}
            disabled={!pagination.hasNextPage}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default PostsList;
