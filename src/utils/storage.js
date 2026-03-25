const USERS_KEY = 'writespace_users'
const POSTS_KEY = 'writespace_posts'

export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  } catch {
    // silent fail
  }
}

export function addUser(user) {
  try {
    const users = getUsers()
    const newUser = { ...user, id: crypto.randomUUID() }
    users.push(newUser)
    setUsers(users)
    return newUser
  } catch {
    return null
  }
}

export function updateUser(id, updates) {
  try {
    const users = getUsers()
    const index = users.findIndex((user) => user.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...updates }
    setUsers(users)
    return users[index]
  } catch {
    return null
  }
}

export function removeUser(id) {
  try {
    const users = getUsers()
    const filtered = users.filter((user) => user.id !== id)
    setUsers(filtered)
    return true
  } catch {
    return false
  }
}

export function getPosts() {
  try {
    const data = localStorage.getItem(POSTS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function setPosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  } catch {
    // silent fail
  }
}

export function addPost(post) {
  try {
    const posts = getPosts()
    const newPost = { ...post, id: crypto.randomUUID() }
    posts.push(newPost)
    setPosts(posts)
    return newPost
  } catch {
    return null
  }
}

export function updatePost(id, updates) {
  try {
    const posts = getPosts()
    const index = posts.findIndex((post) => post.id === id)
    if (index === -1) return null
    posts[index] = { ...posts[index], ...updates }
    setPosts(posts)
    return posts[index]
  } catch {
    return null
  }
}

export function removePost(id) {
  try {
    const posts = getPosts()
    const filtered = posts.filter((post) => post.id !== id)
    setPosts(filtered)
    return true
  } catch {
    return false
  }
}