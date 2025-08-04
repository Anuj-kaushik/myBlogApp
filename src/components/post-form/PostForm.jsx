import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (data) => {
    if (!userData || !userData.$id) {
      setError("User not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (post) {
        // Update existing post
        let file = null;
        if (data.image && data.image[0]) {
          file = await appwriteService.uploadFile(data.image[0]);
          if (file && post.featuredImage) {
            await appwriteService.deleteFile(post.featuredImage);
          }
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : post.featuredImage,
        });

        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        // Create new post
        let file = null;
        if (data.image && data.image[0]) {
          file = await appwriteService.uploadFile(data.image[0]);
        }

        if (file) {
          const fileId = file.$id;
          data.featuredImage = fileId;
          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        } else {
          setError("Please select a featured image for your post.");
        }
      }
    } catch (error) {
      console.error("Post submission error:", error);
      setError(error.message || "Failed to save post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string")
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]+/g, "-")
        .replace(/\s/g, "-");

    return "";
  }, []);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-xl text-gray-600">
            {post ? "Update your existing post" : "Share your story with the world"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit(submit)} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title */}
                <div>
                  <Input
                    label="Post Title"
                    placeholder="Enter an engaging title for your post"
                    className="text-lg"
                    {...register("title", { 
                      required: "Title is required",
                      minLength: {
                        value: 5,
                        message: "Title must be at least 5 characters long"
                      }
                    })}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <Input
                    label="URL Slug"
                    placeholder="post-url-slug"
                    {...register("slug", { 
                      required: "Slug is required",
                      pattern: {
                        value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                        message: "Slug can only contain lowercase letters, numbers, and hyphens"
                      }
                    })}
                    onInput={(e) => {
                      setValue("slug", slugTransform(e.currentTarget.value), {
                        shouldValidate: true,
                      });
                    }}
                  />
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    This will be the URL of your post. It's automatically generated from the title.
                  </p>
                </div>

                {/* Content Editor */}
                <div>
                  <RTE
                    label="Post Content"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                  />
                </div>
              </div>

              {/* Sidebar - Right Side */}
              <div className="space-y-6">
                {/* Featured Image */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Image</h3>
                  
                  <Input
                    label="Upload Image"
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                    {...register("image", { 
                      required: !post ? "Featured image is required" : false 
                    })}
                  />
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
                  )}

                  {post && post.featuredImage && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Current image:</p>
                      <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="w-full rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                </div>

                {/* Post Status */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Post Status</h3>
                  
                  <Select
                    options={["active", "inactive"]}
                    label="Visibility"
                    {...register("status", { required: "Status is required" })}
                  />
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                  
                  <p className="mt-2 text-sm text-gray-600">
                    {watch("status") === "active" 
                      ? "Your post will be visible to all users." 
                      : "Your post will be saved as draft and won't be visible to others."
                    }
                  </p>
                </div>

                {/* Submit Button */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {post ? "Updating..." : "Publishing..."}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {post ? "Update Post" : "Publish Post"}
                      </div>
                    )}
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full mt-3 text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}