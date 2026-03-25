import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import PostCard from '../components/PostCard.jsx'
import { getPosts } from '../utils/storage.js'

export default function BlogListPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    try {
      const allPosts = getPosts()
      const sorted = allPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setPosts(sorted)
    } catch {
      setPosts([])
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All Blogs
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Browse the latest posts from the community.
              </p>
            </div>
            <Link
              to="/blogs/new"
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              ✍️ Write a Post
            </Link>
          </div>

          {/* Posts Grid or Empty State */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-3xl mb-4">
                📝
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                No posts yet
              </h2>
              <p className="mt-2 text-gray-600">
                Be the first to share something with the community!
              </p>
              <Link
                to="/blogs/new"
                className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}