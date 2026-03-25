import { Navigate } from 'react-router-dom'
import { getSession } from '../utils/auth.js'

export default function ProtectedRoute({ children }) {
  try {
    const session = getSession()
    if (!session) return <Navigate to="/login" replace />
    return children
  } catch {
    return <Navigate to="/login" replace />
  }
}