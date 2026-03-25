import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSession, logout } from '../utils/auth.js'
import { isAdmin } from '../utils/accessControl.js'
import { getAvatar } from '../utils/avatar.jsx'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  const session = getSession()

  if (!session) return null

  const admin = isAdmin(session)

  function handleLogout() {
    try {
      logout()
      setDropdownOpen(false)
      setMobileOpen(false)
      navigate('/')
    } catch {
      // silent fail
    }
  }

  function toggleMobile() {
    setMobileOpen((prev) => !prev)
    setDropdownOpen(false)
  }

  function toggleDropdown() {
    setDropdownOpen((prev) => !prev)
  }

  function closeMenus() {
    setMobileOpen(false)
    setDropdownOpen(false)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/blogs"
              className="text-xl font-bold text-indigo-600"
              onClick={closeMenus}
            >
              WriteSpace
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link
              to="/blogs"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              All Blogs
            </Link>
            <Link
              to="/blogs/new"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Write
            </Link>
            {admin && (
              <Link
                to="/admin/users"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Users
              </Link>
            )}

            {/* Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 focus:outline-none"
                aria-label="User menu"
              >
                {getAvatar(session.role)}
                <span className="text-gray-700 font-medium text-sm">
                  {session.displayName}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 text-sm text-gray-500 border-b">
                    {session.role}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={toggleMobile}
              className="text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t">
          <div className="px-4 py-3 space-y-2">
            <div className="flex items-center space-x-2 pb-2 border-b">
              {getAvatar(session.role)}
              <span className="text-gray-700 font-medium text-sm">
                {session.displayName}
              </span>
              <span className="text-xs text-gray-500">({session.role})</span>
            </div>
            <Link
              to="/blogs"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
              onClick={closeMenus}
            >
              All Blogs
            </Link>
            <Link
              to="/blogs/new"
              className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
              onClick={closeMenus}
            >
              Write
            </Link>
            {admin && (
              <Link
                to="/admin/users"
                className="block text-gray-700 hover:text-indigo-600 font-medium py-1"
                onClick={closeMenus}
              >
                Users
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="block w-full text-left text-gray-700 hover:text-indigo-600 font-medium py-1"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}