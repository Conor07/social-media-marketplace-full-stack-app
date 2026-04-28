import { useAppDispatch } from "../app/hooks";
import React, { useEffect, useState } from "react";
import {
  createPostThunk,
  fetchPostsThunk,
  selectPosts,
  updatePostThunk,
} from "../features/posts/postsSlice";
import { useSelector } from "react-redux";
import type { Post } from "../types";
import CreatePostForm from "../components/CreatePostForm";
import PostsList from "../components/PostsList";

type PostsProps = {};

const Posts: React.FC<PostsProps> = ({}) => {
  const dispatch = useAppDispatch();

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

  const { pagination } = useSelector(selectPosts);

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      const newPage = pagination.page - 1;

      dispatch(fetchPostsThunk(newPage));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      const newPage = pagination.page + 1;

      dispatch(fetchPostsThunk(newPage));
    }
  };

  return (
    <div className="mb-4 flex flex-col items-center p-4 min-h-screen bg-gray-100 gap-4 ">
      <h2 className="text-2xl">Posts: </h2>

      <CreatePostForm
        postForm={postForm}
        onPostChange={handlePostChange}
        onAddPost={handleAddPost}
        onSubmitUpdatePost={handleSubmitUpdatePost}
        onCancel={() =>
          setPostForm({
            id: 0,
            title: "",
            content: "",
            userId: "",
            likes: [],
          })
        }
      />

      <PostsList
        posts={posts}
        fetchStatus={postsFetchStatus}
        fetchError={postsFetchError}
        pagination={pagination}
        onEditPost={handleUpdatePost}
        onPreviousPage={handlePreviousPage}
        onNextPage={handleNextPage}
      />
    </div>
  );
};

export default Posts;
