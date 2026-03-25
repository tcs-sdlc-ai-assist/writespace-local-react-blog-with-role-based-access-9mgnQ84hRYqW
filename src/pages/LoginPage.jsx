import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSession, login } from '../utils/auth.js'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const session = getSession()
      if (session) {
        if (session.role === 'Admin') {
          navigate('/admin', { replace: true })
        } else {
          navigate('/blogs', { replace: true })
        }
      }
    } catch {
      // silent fail
    }
  }, [navigate])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      if (!username.trim() || !password.trim()) {
        setError('Username and password are required.')
        return
      }

      const session = login(username.trim(), password)

      if (!session) {
        setError('Invalid username or password.')
        return
      }

      if (session.role === 'Admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/blogs', { replace: true })
      }
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            WriteSpace
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter your username"
            />
          </div>

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
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}