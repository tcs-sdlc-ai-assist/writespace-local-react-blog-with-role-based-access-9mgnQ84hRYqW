import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getSession } from '../utils/auth.js'
import { canEditPost, canDeletePost } from '../utils/accessControl.js'
import { getPosts, removePost } from '../utils/storage.js'
import { getAvatar } from '../utils/avatar.jsx'

export default function BlogDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    try {
      const session = getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      const posts = getPosts()
      const found = posts.find((p) => p.id === id)

      if (!found) {
        setNotFound(true)
        return
      }

      setPost(found)
    } catch {
      setNotFound(true)
    }
  }, [id, navigate])

  const session = getSession()

  const showEdit = session && post && canEditPost(session, post)
  const showDelete = session && post && canDeletePost(session, post)

  const formattedDate = post && post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  function handleDelete() {
    try {
      const success = removePost(id)
      if (success) {
        navigate('/blogs', { replace: true })
      }
    } catch {
      // silent fail
    }
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />

        <main className="flex-1">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 text-3xl mb-4">
              🔍
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Post Not Found
            </h1>
            <p className="mt-2 text-gray-600">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="mt-6 inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
            >
              Back to All Blogs
            </Link>
          </div>
        </main>

        <div className="mt-auto">
          <Footer />
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Link */}
          <div className="mb-6">
            <Link
              to="/blogs"
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              &larr; Back to All Blogs
            </Link>
          </div>

          {/* Post Header */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {post.title}
            </h1>

            {/* Author Info */}
            <div className="mt-4 flex items-center space-x-3">
              {getAvatar(post.authorRole || 'Viewer')}
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {post.authorDisplayName || 'Unknown'}
                </p>
                {formattedDate && (
                  <p className="text-xs text-gray-400">{formattedDate}</p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="mt-6 text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>

            {/* Actions */}
            {(showEdit || showDelete) && (
              <div className="mt-8 pt-6 border-t flex items-center space-x-4">
                {showEdit && (
                  <Link
                    to={`/blogs/edit/${post.id}`}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                  >
                    Edit Post
                  </Link>
                )}
                {showDelete && (
                  <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
                  >
                    Delete Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-900">Delete Post</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}