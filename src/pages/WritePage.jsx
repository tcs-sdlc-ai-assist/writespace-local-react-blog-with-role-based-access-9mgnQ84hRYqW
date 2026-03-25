import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { getSession } from '../utils/auth.js'
import { canEditPost } from '../utils/accessControl.js'
import { getPosts, addPost, updatePost } from '../utils/storage.js'

export default function WritePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    try {
      const session = getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      if (isEdit) {
        const posts = getPosts()
        const post = posts.find((p) => p.id === id)

        if (!post) {
          navigate('/blogs', { replace: true })
          return
        }

        if (!canEditPost(session, post)) {
          navigate('/blogs', { replace: true })
          return
        }

        setTitle(post.title || '')
        setContent(post.content || '')
      }
    } catch {
      navigate('/blogs', { replace: true })
    }
  }, [id, isEdit, navigate])

  function validate() {
    const errors = {}

    if (!title.trim()) {
      errors.title = 'Title is required.'
    }

    if (!content.trim()) {
      errors.content = 'Content is required.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const session = getSession()
      if (!session) {
        navigate('/login', { replace: true })
        return
      }

      if (!validate()) return

      if (isEdit) {
        const posts = getPosts()
        const post = posts.find((p) => p.id === id)

        if (!post) {
          setError('Post not found.')
          return
        }

        if (!canEditPost(session, post)) {
          setError('You do not have permission to edit this post.')
          return
        }

        const updated = updatePost(id, {
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        })

        if (!updated) {
          setError('Failed to update post. Please try again.')
          return
        }
      } else {
        const newPost = addPost({
          title: title.trim(),
          content: content.trim(),
          authorId: session.id,
          authorDisplayName: session.displayName,
          authorRole: session.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })

        if (!newPost) {
          setError('Failed to create post. Please try again.')
          return
        }
      }

      navigate('/blogs', { replace: true })
    } catch {
      setError('An error occurred. Please try again.')
    }
  }

  function handleCancel() {
    navigate(-1)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isEdit ? 'Edit Post' : 'Write a New Post'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {isEdit
                ? 'Update your blog post below.'
                : 'Share your thoughts with the community.'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (fieldErrors.title) {
                    setFieldErrors((prev) => ({ ...prev, title: '' }))
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Enter your post title"
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content
              </label>
              <textarea
                id="content"
                rows={12}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value)
                  if (fieldErrors.content) {
                    setFieldErrors((prev) => ({ ...prev, content: '' }))
                  }
                }}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Write your blog content here..."
              />
              <div className="mt-1 flex justify-between items-center">
                {fieldErrors.content ? (
                  <p className="text-sm text-red-600">{fieldErrors.content}</p>
                ) : (
                  <span />
                )}
                <p className="text-xs text-gray-400">
                  {content.length} character{content.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEdit ? 'Update Post' : 'Publish Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-6 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}