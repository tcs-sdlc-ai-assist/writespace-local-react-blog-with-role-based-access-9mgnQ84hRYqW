const SESSION_KEY = 'writespace_session'

import { getUsers, addUser } from './storage.js'

export function getSession() {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setSession(sessionObj) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj))
  } catch {
    // silent fail
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // silent fail
  }
}

export function login(username, password) {
  try {
    if (username === 'admin' && password === 'admin') {
      const session = {
        id: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'Admin',
      }
      setSession(session)
      return session
    }

    const users = getUsers()
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (!user) return null

    const session = {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    }
    setSession(session)
    return session
  } catch {
    return null
  }
}

export function register(displayName, username, password) {
  try {
    const users = getUsers()
    const exists = users.some((u) => u.username === username)
    if (exists) return null

    const newUser = addUser({
      displayName,
      username,
      password,
      role: 'Viewer',
    })

    if (!newUser) return null

    const session = {
      id: newUser.id,
      username: newUser.username,
      displayName: newUser.displayName,
      role: newUser.role,
    }
    setSession(session)
    return session
  } catch {
    return null
  }
}

export function logout() {
  try {
    clearSession()
  } catch {
    // silent fail
  }
}