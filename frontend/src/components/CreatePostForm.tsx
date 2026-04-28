import React from "react";
import type { Post } from "../types";

type CreatePostFormProps = {
  postForm: Post;
  onPostChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  onAddPost: (e: React.FormEvent<HTMLFormElement>) => void;
  onSubmitUpdatePost: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({
  postForm,
  onPostChange,
  onAddPost,
  onSubmitUpdatePost,
  onCancel,
}) => {
  return (
    <form
      onSubmit={postForm.id ? onSubmitUpdatePost : onAddPost}
      style={{ marginBottom: 8 }}
      className="flex flex-col gap-4 border-gray-400 border rounded p-4 w-full max-w-md bg-white"
    >
      <input
        name="title"
        placeholder="Title"
        value={postForm.title}
        onChange={onPostChange}
        required
        className="m-4 p-2 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
      />

      <textarea
        name="content"
        placeholder="Content"
        value={postForm.content}
        onChange={onPostChange}
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
            onClick={onCancel}
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
  );
};

export default CreatePostForm;
