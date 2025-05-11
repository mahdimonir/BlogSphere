"use client";

import axiosInstance from "@/app/utils/axiosConfig";
import { useAuth } from "@/context/AuthContext";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { TagsInput } from "react-tag-input-component";

export default function PostForm({ postId = null, initialData = null }) {
  const { user } = useAuth();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(initialData?.image || null);
  const [existingImage, setExistingImage] = useState(
    initialData?.image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // TipTap editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { HTMLAttributes: { class: "list-disc" } },
        orderedList: { HTMLAttributes: { class: "list-decimal" } },
      }),
    ],
    content: initialData?.content || "",
    onUpdate: ({ editor }) => {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
  });

  // Form setup with react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      title: initialData?.title || "",
      content: initialData?.content || "",
      tableOfContents:
        initialData?.contentTable?.[0] || initialData?.tableOfContents || "",
      catagory: initialData?.catagory || [],
      tags: initialData?.tags
        ? typeof initialData.tags === "string"
          ? JSON.parse(initialData.tags)
          : initialData.tags
        : [],
      image: null,
    },
  });

  // Available categories (sync with FilterBar.jsx)
  const categories = [
    "General",
    "Adventure",
    "Food",
    "Technology",
    "Travel",
    "Lifestyle",
    "Art",
    "Trending",
  ];

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
      setExistingImage(null);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!user) {
      toast.error("Please log in to save the post");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const postData = new FormData();
      postData.append("title", data.title);
      postData.append("content", data.content);
      postData.append("tableOfContents", data.tableOfContents);
      data.catagory.forEach((cat) => postData.append("catagory", cat));
      postData.append("tags", JSON.stringify(data.tags)); // Send as stringified array
      if (data.image) {
        postData.append("image", data.image);
      }

      const isEditMode = !!postId;
      const url = isEditMode ? `/posts/${postId}` : "/posts";
      const method = isEditMode ? "patch" : "post";

      const response = await axiosInstance[method](url, postData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === (isEditMode ? 200 : 201)) {
        toast.success(
          `Post ${isEditMode ? "updated" : "created"} successfully`
        );
        router.push("/posts");
      }
    } catch (error) {
      console.error(`Error ${postId ? "updating" : "creating"} post:`, error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${postId ? "update" : "create"} post`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-300">
        <p>
          Please{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            log in
          </a>{" "}
          to {postId ? "edit" : "create"} a post.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
    >
      {/* Title */}
      <div className="mb-6">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Title
        </label>
        <input
          id="title"
          {...register("title", { required: "Title is required" })}
          className={`mt-1 block w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
            errors.title ? "border-red-500" : ""
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Content */}
      <div className="mb-6">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Content
        </label>
        {previewMode ? (
          <div
            className="mt-1 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: initialData?.content || "" }}
          />
        ) : (
          <Controller
            name="content"
            control={control}
            rules={{ required: "Content is required" }}
            render={() => (
              <div className="border rounded-lg bg-gray-50 dark:bg-gray-700">
                <EditorContent
                  editor={editor}
                  className="p-3 text-gray-900 dark:text-gray-100"
                />
              </div>
            )}
          />
        )}
        {errors.content && (
          <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>
        )}
      </div>

      {/* Table of Contents */}
      <div className="mb-6">
        <label
          htmlFor="tableOfContents"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Table of Contents (Markdown)
        </label>
        <textarea
          id="tableOfContents"
          {...register("tableOfContents")}
          rows={4}
          placeholder="e.g., - Introduction\n- Section 1\n- Section 2"
          className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {previewMode && initialData?.contentTable?.[0] && (
          <div className="mt-2 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
            <h4 className="font-semibold">TOC Preview</h4>
            <pre className="text-sm">{initialData.contentTable[0]}</pre>
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label
          htmlFor="catagory"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Categories
        </label>
        <Controller
          name="catagory"
          control={control}
          rules={{ required: "Select at least one category" }}
          render={({ field }) => (
            <select
              id="catagory"
              multiple
              value={field.value}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                field.onChange(selected);
              }}
              className={`mt-1 block w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                errors.catagory ? "border-red-500" : ""
              }`}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.
        </p>
        {errors.catagory && (
          <p className="text-red-500 text-xs mt-1">{errors.catagory.message}</p>
        )}
      </div>

      {/* Tags */}
      <div className="mb-6">
        <label
          htmlFor="tags"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Tags
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagsInput
              value={field.value}
              onChange={field.onChange}
              placeHolder="Enter tags (e.g., javascript, coding)"
              classNames={{
                tag: "bg-blue-500 text-white px-2 py-1 rounded-full text-sm mr-1",
                input:
                  "p-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100",
              }}
            />
          )}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Press Enter to add a tag.
        </p>
      </div>

      {/* Image */}
      <div className="mb-6">
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Image
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 transition"
        />
        {imagePreview && (
          <div className="mt-2 relative group">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-xs rounded-lg object-cover transition transform group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => {
                setValue("image", null);
                setImagePreview(existingImage);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        )}
        {existingImage && !imagePreview && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Current image will be kept unless a new one is uploaded.
          </p>
        )}
      </div>

      {/* Form Actions */}
      <div className="sticky bottom-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex justify-end gap-4">
        <a
          href="/posts"
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition"
        >
          Cancel
        </a>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Saving..." : postId ? "Update Post" : "Create Post"}
        </button>
      </div>
    </form>
  );
}
