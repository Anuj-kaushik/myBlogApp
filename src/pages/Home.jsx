import React, { useEffect, useState } from 'react'
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const authStatus = useSelector((state) => state.auth.status)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                setError("")
                const response = await appwriteService.getPosts()
                if (response && response.documents) {
                    setPosts(response.documents)
                } else {
                    setPosts([])
                }
            } catch (error) {
                console.error("Error fetching posts:", error)
                setError("Failed to load posts. Please try again later.")
                setPosts([])
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600">Loading posts...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Container>
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <h2 className="text-xl font-semibold text-red-800 mb-2">
                                    Oops! Something went wrong
                                </h2>
                                <p className="text-red-600 mb-4">{error}</p>
                                <button 
                                    onClick={() => window.location.reload()}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (!authStatus) {
        return (
            <div className="min-h-screen">
                <Container>
                    {/* Hero Section */}
                    <div className="text-center py-20">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-indigo-600">BlogSpace</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Discover amazing stories, share your thoughts, and connect with a community of writers and readers.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                to="/signup"
                                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Get Started
                            </Link>
                            <Link 
                                to="/login"
                                className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>

                    {/* Features Section */}
                    <div className="py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Why Choose BlogSpace?
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 px-8">
                            <div className="text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Writing</h3>
                                <p className="text-gray-600">Rich text editor with all the tools you need to create beautiful content.</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
                                <p className="text-gray-600">Connect with like-minded writers and readers from around the world.</p>
                            </div>
                            <div className="text-center">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast & Secure</h3>
                                <p className="text-gray-600">Lightning-fast performance with enterprise-grade security for your content.</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen">
                <Container>
                    <div className="text-center py-20">
                        <div className="max-w-md mx-auto">
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                                <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                    Welcome, {userData?.name}!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    No posts available yet. Be the first to share your story with the community!
                                </p>
                                <Link 
                                    to="/add-post"
                                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                                >
                                    Create Your First Post
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12">
            <Container>
                {/* Welcome Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome back, {userData?.name}!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Discover the latest stories from our community
                    </p>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post.$id} className="transform hover:scale-105 transition-transform duration-200">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center mt-16 py-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Ready to share your story?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Join the conversation and let your voice be heard.
                    </p>
                    <Link 
                        to="/add-post"
                        className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                    >
                        Write a New Post
                    </Link>
                </div>
            </Container>
        </div>
    )
}

export default Home