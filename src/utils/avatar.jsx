export function getAvatar(role) {
  try {
    if (role === 'Admin') {
      return (
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-500 text-white text-sm"
          aria-label="Admin avatar"
          role="img"
        >
          👑
        </span>
      )
    }

    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm"
        aria-label="Viewer avatar"
        role="img"
      >
        📖
      </span>
    )
  } catch {
    return null
  }
}