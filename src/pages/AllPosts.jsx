import React, { useState, useEffect } from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                setLoading(true)
                setError("")
                const response = await appwriteService.getPosts([])
                if (response && response.documents) {
                    setPosts(response.documents)
                } else {
                    setPosts([])
                }
            } catch (error) {
                console.error("Error fetching all posts:", error)
                setError("Failed to load posts. Please try again later.")
                setPosts([])
            } finally {
                setLoading(false)
            }
        }

        fetchAllPosts()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="text-gray-600">Loading all posts...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen py-12">
                <Container>
                    <div className="text-center">
                        <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-red-800 mb-2">
                                Error Loading Posts
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
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen py-12">
                <Container>
                    <div className="text-center">
                        <div className="max-w-md mx-auto bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                No Posts Yet
                            </h2>
                            <p className="text-gray-600 mb-6">
                                There are no posts available at the moment. Be the first to create one!
                            </p>
                            <a 
                                href="/add-post"
                                className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                Create First Post
                            </a>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-12">
            <Container>
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        All Posts
                    </h1>
                    <p className="text-xl text-gray-600">
                        Explore all the amazing content from our community
                    </p>
                    <div className="mt-4 text-sm text-gray-500">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'} found
                    </div>
                </div>

                {/* Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post.$id} className="transform hover:scale-105 transition-transform duration-200">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default AllPosts