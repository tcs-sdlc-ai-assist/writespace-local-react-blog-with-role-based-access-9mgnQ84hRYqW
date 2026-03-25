import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import StatCard from '../components/StatCard.jsx'
import { getSession } from '../utils/auth.js'
import { isAdmin, canEditPost, canDeletePost } from '../utils/accessControl.js'
import { getPosts, getUsers, removePost } from '../utils/storage.js'
import { getAvatar } from '../utils/avatar.jsx'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    try {
      const session = getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }
      if (!isAdmin(session)) {
        navigate('/blogs', { replace: true })
        return
      }

      const allPosts = getPosts()
      const sorted = allPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
      setPosts(sorted)

      const allUsers = getUsers()
      setUsers(allUsers)
    } catch {
      setPosts([])
      setUsers([])
    }
  }, [navigate])

  const session = getSession()

  const totalPosts = posts.length
  const totalUsers = users.length + 1 // +1 for hardcoded admin
  const adminCount = users.filter((u) => u.role === 'Admin').length + 1
  const viewerCount = users.filter((u) => u.role === 'Viewer').length

  const recentPosts = posts.slice(0, 5)

  function handleDeleteClick(id) {
    setDeleteId(id)
    setShowConfirm(true)
  }

  function handleDelete() {
    try {
      const success = removePost(deleteId)
      if (success) {
        setPosts((prev) => prev.filter((p) => p.id !== deleteId))
      }
    } catch {
      // silent fail
    }
    setShowConfirm(false)
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Gradient Banner */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-lg shadow-md p-6 sm:p-8 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-indigo-100">
              Welcome back, {session ? session.displayName : 'Admin'}. Here&apos;s an overview of your platform.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Posts"
              count={totalPosts}
              icon="📝"
              color="indigo"
            />
            <StatCard
              label="Total Users"
              count={totalUsers}
              icon="👥"
              color="green"
            />
            <StatCard
              label="Admins"
              count={adminCount}
              icon="👑"
              color="violet"
            />
            <StatCard
              label="Viewers"
              count={viewerCount}
              icon="📖"
              color="blue"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/blogs/new"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                ✍️ Write New Post
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50"
              >
                👥 Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Recent Posts
            </h2>

            {recentPosts.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {recentPosts.map((post) => {
                    const formattedDate = post.createdAt
                      ? new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''

                    const showEdit = session && canEditPost(session, post)
                    const showDelete = session && canDeletePost(session, post)

                    return (
                      <div
                        key={post.id}
                        className="p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          {getAvatar(post.authorRole || 'Viewer')}
                          <div className="min-w-0">
                            <Link
                              to={`/blog/${post.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-indigo-600 truncate block"
                            >
                              {post.title}
                            </Link>
                            <p className="text-xs text-gray-500">
                              {post.authorDisplayName || 'Unknown'}
                              {formattedDate && ` · ${formattedDate}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                          {showEdit && (
                            <Link
                              to={`/blogs/edit/${post.id}`}
                              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                              Edit
                            </Link>
                          )}
                          {showDelete && (
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(post.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-3xl mb-4">
                  📝
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  No posts yet
                </h3>
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
                onClick={() => {
                  setShowConfirm(false)
                  setDeleteId(null)
                }}
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