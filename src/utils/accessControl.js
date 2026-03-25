export function isAdmin(session) {
  try {
    return session && session.role === 'Admin'
  } catch {
    return false
  }
}

export function canEditPost(session, post) {
  try {
    if (!session || !post) return false
    if (session.role === 'Admin') return true
    return session.id === post.authorId
  } catch {
    return false
  }
}

export function canDeletePost(session, post) {
  try {
    if (!session || !post) return false
    if (session.role === 'Admin') return true
    return session.id === post.authorId
  } catch {
    return false
  }
}

export function canDeleteUser(session, user) {
  try {
    if (!session || !user) return false
    if (session.role !== 'Admin') return false
    if (user.id === 'admin') return false
    if (user.id === session.id) return false
    return true
  } catch {
    return false
  }
}

export function requireAuth(session) {
  try {
    if (!session) return null
    return session
  } catch {
    return null
  }
}

export function requireAdmin(session) {
  try {
    if (!session || session.role !== 'Admin') return null
    return session
  } catch {
    return null
  }
}