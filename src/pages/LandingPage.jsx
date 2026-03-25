import { Link } from 'react-router-dom'
import PublicNavbar from '../components/PublicNavbar.jsx'
import Footer from '../components/Footer.jsx'
import PostCard from '../components/PostCard.jsx'
import { getPosts } from '../utils/storage.js'

export default function LandingPage() {
  let latestPosts = []
  try {
    const allPosts = getPosts()
    latestPosts = allPosts
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
  } catch {
    latestPosts = []
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
            Welcome to{' '}
            <span className="text-indigo-600">WriteSpace</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            A local blog platform with role-based access. Write, share, and
            manage blog posts — all from your browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 w-full sm:w-auto justify-center"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 text-sm font-medium rounded-md border border-indigo-600 hover:bg-indigo-50 w-full sm:w-auto justify-center"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Why WriteSpace?
          </h2>
          <p className="mt-2 text-gray-600 text-center max-w-xl mx-auto">
            Everything you need to start blogging, right in your browser.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 text-xl mb-4">
                ✍️
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Write & Publish
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Create and publish blog posts instantly. No setup, no server —
                just start writing.
              </p>
            </div>

            {/* Feature Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 text-xl mb-4">
                🔒
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Role-Based Access
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Admins manage users and all content. Viewers can read and write
                their own posts.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-violet-100 text-violet-600 text-xl mb-4">
                💾
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Local Storage
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                All data stays in your browser. No accounts, no cloud — fully
                private and offline-ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center">
            Latest Posts
          </h2>
          <p className="mt-2 text-gray-600 text-center max-w-xl mx-auto">
            Check out what people have been writing.
          </p>

          {latestPosts.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-10 text-center">
              <p className="text-gray-500">
                No posts yet. Be the first to write something!
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}