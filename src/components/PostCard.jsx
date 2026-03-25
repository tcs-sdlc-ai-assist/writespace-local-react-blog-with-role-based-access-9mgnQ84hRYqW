import { Link } from 'react-router-dom'
import { getSession } from '../utils/auth.js'
import { canEditPost } from '../utils/accessControl.js'
import { getAvatar } from '../utils/avatar.jsx'

export default function PostCard({ post }) {
  const session = getSession()

  if (!post) return null

  const excerpt =
    post.content && post.content.length > 120
      ? post.content.substring(0, 120) + '...'
      : post.content || ''

  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : ''

  const showEdit = session && canEditPost(session, post)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        {/* Title */}
        <Link to={`/blog/${post.id}`}>
          <h2 className="text-lg font-bold text-gray-900 hover:text-indigo-600 line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="mt-2 text-sm text-gray-600 line-clamp-3">{excerpt}</p>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          {/* Author */}
          <div className="flex items-center space-x-2">
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

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link
              to={`/blog/${post.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Read
            </Link>
            {showEdit && (
              <Link
                to={`/blogs/edit/${post.id}`}
                className="text-gray-500 hover:text-indigo-600"
                aria-label="Edit post"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}