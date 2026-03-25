import { Link } from 'react-router-dom'
import { getSession } from '../utils/auth.js'
import { isAdmin } from '../utils/accessControl.js'
import { getAvatar } from '../utils/avatar.jsx'

export default function PublicNavbar() {
  const session = getSession()

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-indigo-600"
            >
              WriteSpace
            </Link>
          </div>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  to="/blogs"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  All Blogs
                </Link>
                {isAdmin(session) && (
                  <Link
                    to="/admin/users"
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Users
                  </Link>
                )}
                <Link
                  to="/blogs"
                  className="flex items-center space-x-2"
                >
                  {getAvatar(session.role)}
                  <span className="text-gray-700 font-medium text-sm">
                    {session.displayName}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-indigo-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}