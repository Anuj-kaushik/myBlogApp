import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userId === userData.$id : false;   

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
                console.error("Error fetching post:", error);
                setError("Failed to load post. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    const deletePost = async () => {
        if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
            return;
        }

        setDeleteLoading(true);
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                if (post.featuredImage) {
                    await appwriteService.deleteFile(post.featuredImage);
                }
                navigate("/");
            } else {
                setError("Failed to delete post. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            setError("Failed to delete post. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600">Loading post...</p>
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
                                {error.includes("not found") ? "Post Not Found" : "Error Loading Post"}
                            </h2>
                            <p className="text-red-600 mb-4">{error}</p>
                            <Link 
                                to="/"
                                className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Go Back Home
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen py-12">
            <Container>
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {/* Post Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            {post.title}
                        </h1>
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
                            <div className="flex items-center mr-6">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span>By Author</span>
                            </div>
                            
                            {post.$createdAt && (
                                <div className="flex items-center mr-6">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{formatDate(post.$createdAt)}</span>
                                </div>
                            )}

                            <div className="flex items-center">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    post.status === 'active' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {post.status === 'active' ? 'Published' : 'Draft'}
                                </div>
                            </div>
                        </div>

                        {/* Author Actions */}
                        {isAuthor && (
                            <div className="flex flex-wrap gap-3 mb-8">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Post
                                    </Button>
                                </Link>
                                <Button 
                                    onClick={deletePost}
                                    disabled={deleteLoading}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 disabled:opacity-50"
                                >
                                    {deleteLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete Post
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </header>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-lg">
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Post Content */}
                    <article className="prose prose-lg max-w-none">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                            <div className="prose-content">
                                {parse(post.content || "")}
                            </div>
                        </div>
                    </article>

                    {/* Post Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex justify-center">
                            <Link 
                                to="/all-posts"
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                Read More Posts
                            </Link>
                        </div>
                    </footer>
                </div>
            </Container>
        </div>
    );
}