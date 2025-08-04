import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage, content, userId, $createdAt }) {
    // Extract first few words from content for preview
    const getContentPreview = (htmlContent) => {
        if (!htmlContent) return "No content available..."
        
        // Remove HTML tags and get first 100 characters
        const textContent = htmlContent.replace(/<[^>]*>/g, '')
        return textContent.length > 100 
            ? textContent.substring(0, 100) + "..." 
            : textContent
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return ""
        
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    return (
        <Link to={`/post/${$id}`} className="block group">
            <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200 group-hover:-translate-y-1">
                {/* Featured Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden">
                    {featuredImage ? (
                        <img 
                            src={appwriteService.getFilePreview(featuredImage)} 
                            alt={title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Title */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {title || "Untitled Post"}
                    </h2>

                    {/* Content Preview */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {getContentPreview(content)}
                    </p>

                    {/* Meta Information */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span>By Author</span>
                        </div>
                        
                        {$createdAt && (
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{formatDate($createdAt)}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Read More Indicator */}
                <div className="px-6 pb-4">
                    <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                        <span>Read more</span>
                        <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default PostCard