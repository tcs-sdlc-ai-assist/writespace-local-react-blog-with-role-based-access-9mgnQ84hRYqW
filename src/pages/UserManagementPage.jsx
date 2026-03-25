import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getSession } from '../utils/auth.js'
import { isAdmin, canDeleteUser } from '../utils/accessControl.js'
import { getUsers, addUser, removeUser } from '../utils/storage.js'
import { getAvatar } from '../utils/avatar.jsx'

export default function UserManagementPage() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Viewer')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

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

      loadUsers()
    } catch {
      setUsers([])
    }
  }, [navigate])

  const session = getSession()

  function loadUsers() {
    try {
      const allUsers = getUsers()
      setUsers(allUsers)
    } catch {
      setUsers([])
    }
  }

  function getAllUsersWithAdmin() {
    const adminUser = {
      id: 'admin',
      displayName: 'Admin',
      username: 'admin',
      role: 'Admin',
    }
    return [adminUser, ...users]
  }

  function validate() {
    const errors = {}

    if (!displayName.trim()) {
      errors.displayName = 'Display name is required.'
    }

    if (!username.trim()) {
      errors.username = 'Username is required.'
    }

    if (!password.trim()) {
      errors.password = 'Password is required.'
    }

    if (username.trim()) {
      const allUsers = getAllUsersWithAdmin()
      const exists = allUsers.some(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase()
      )
      if (exists) {
        errors.username = 'Username already exists.'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleCreateUser(e) {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    try {
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      if (!validate()) return

      const newUser = addUser({
        displayName: displayName.trim(),
        username: username.trim(),
        password: password,
        role: role,
      })

      if (!newUser) {
        setError('Failed to create user. Please try again.')
        return
      }

      setDisplayName('')
      setUsername('')
      setPassword('')
      setRole('Viewer')
      setFieldErrors({})
      setSuccessMessage('User created successfully.')
      loadUsers()
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  function handleDeleteClick(id) {
    setDeleteId(id)
    setShowConfirm(true)
  }

  function handleDelete() {
    try {
      const success = removeUser(deleteId)
      if (success) {
        setSuccessMessage('User deleted successfully.')
        loadUsers()
      }
    } catch {
      // silent fail
    }
    setShowConfirm(false)
    setDeleteId(null)
  }

  const allUsersWithAdmin = getAllUsersWithAdmin()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all users on the platform. Create new users or remove existing ones.
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Create New User
            </h2>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Display Name */}
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value)
                      if (fieldErrors.displayName) {
                        setFieldErrors((prev) => ({ ...prev, displayName: '' }))
                      }
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter display name"
                  />
                  {fieldErrors.displayName && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.displayName}
                    </p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      if (fieldErrors.username) {
                        setFieldErrors((prev) => ({ ...prev, username: '' }))
                      }
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Choose a username"
                  />
                  {fieldErrors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (fieldErrors.password) {
                        setFieldErrors((prev) => ({ ...prev, password: '' }))
                      }
                    }}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter password"
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              All Users ({allUsersWithAdmin.length})
            </h2>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsersWithAdmin.map((user) => {
                    const deletable = session && canDeleteUser(session, user)
                    const isDefaultAdmin = user.id === 'admin'

                    return (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            {getAvatar(user.role)}
                            <span className="text-sm font-medium text-gray-900">
                              {user.displayName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">
                            {user.username}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'Admin'
                                ? 'bg-violet-100 text-violet-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {isDefaultAdmin ? (
                            <span
                              className="text-sm text-gray-400 cursor-not-allowed"
                              title="Default admin cannot be deleted"
                            >
                              Delete
                            </span>
                          ) : deletable ? (
                            <button
                              type="button"
                              onClick={() => handleDeleteClick(user.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          ) : (
                            <span
                              className="text-sm text-gray-400 cursor-not-allowed"
                              title="Cannot delete this user"
                            >
                              Delete
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {allUsersWithAdmin.map((user) => {
                const deletable = session && canDeleteUser(session, user)
                const isDefaultAdmin = user.id === 'admin'

                return (
                  <div
                    key={user.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getAvatar(user.role)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.displayName}
                          </p>
                          <p className="text-xs text-gray-500">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'Admin'
                            ? 'bg-violet-100 text-violet-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-end">
                      {isDefaultAdmin ? (
                        <span
                          className="text-sm text-gray-400 cursor-not-allowed"
                          title="Default admin cannot be deleted"
                        >
                          Delete
                        </span>
                      ) : deletable ? (
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(user.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      ) : (
                        <span
                          className="text-sm text-gray-400 cursor-not-allowed"
                          title="Cannot delete this user"
                        >
                          Delete
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-bold text-gray-900">Delete User</h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to delete this user? This action cannot be undone.
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