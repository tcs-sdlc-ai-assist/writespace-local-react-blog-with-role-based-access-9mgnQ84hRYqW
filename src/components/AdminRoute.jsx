import { Navigate } from 'react-router-dom'
import { getSession } from '../utils/auth.js'

export default function AdminRoute({ children }) {
  try {
    const session = getSession()
    if (!session) return <Navigate to="/login" replace />
    if (session.role !== 'Admin') return <Navigate to="/blogs" replace />
    return children
  } catch {
    return <Navigate to="/login" replace />
  }
}