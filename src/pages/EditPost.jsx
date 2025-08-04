import React, { useEffect, useState } from "react";
import { Container, PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const fetchedPost = await appwriteService.getPost(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError("Post not found");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("Error fetching post for edit:", error);
        setError("Failed to load post for editing. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-600">Loading post for editing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12">
        <Container>
          <div className="text-center">
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Error Loading Post
              </h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => navigate("/")}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Go Back Home
              </button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8">
      <Container>
        <PostForm post={post} />
      </Container>
    </div>
  );
};

export default EditPost;